import "server-only";

import { connection, NextResponse } from "next/server";
import type { z } from "zod";
import type { ApiErrorCode, ApiErrorResponse } from "@/lib/game/types";
import { isSameOrigin } from "./csrf";
import { AccountsUnavailableError } from "./env";
import { createMemoryRateLimiter, type RateLimiter } from "./rate-limit";

const ERRORS: Record<ApiErrorCode, { status: number; message: string }> = {
  invalid_request: { status: 400, message: "Invalid request" },
  not_in_word_list: { status: 422, message: "Not in word list" },
  no_game: { status: 404, message: "No game in progress" },
  game_over: { status: 409, message: "This game has ended" },
  game_conflict: { status: 409, message: "This game changed. Reloading it." },
  rate_limited: { status: 429, message: "Too many requests" },
  forbidden: { status: 403, message: "Request not allowed" },
  unauthorized: { status: 401, message: "Please log in" },
  invalid_credentials: { status: 401, message: "Incorrect email or password" },
  email_not_confirmed: { status: 403, message: "Please confirm your email first" },
  weak_password: { status: 422, message: "Please choose a stronger password" },
  username_unavailable: { status: 409, message: "That username isn't available" },
  accounts_unavailable: { status: 503, message: "Accounts aren't available right now" },
  server_error: { status: 500, message: "Something went wrong" },
};

const NO_STORE = { "Cache-Control": "no-store" };

export function jsonResponse<T>(body: T): NextResponse<T> {
  return NextResponse.json(body, { headers: NO_STORE });
}

export function errorResponse(
  code: ApiErrorCode,
  extraHeaders?: Record<string, string>,
): NextResponse<ApiErrorResponse> {
  const { status, message } = ERRORS[code];
  return NextResponse.json(
    { error: code, message },
    { status, headers: { ...NO_STORE, ...extraHeaders } },
  );
}

/** Per-minute limits per client address. Generous for play, low enough to slow scripts. */
export const rateLimiters = {
  new: createMemoryRateLimiter({ limit: 30, windowMs: 60_000 }),
  guess: createMemoryRateLimiter({ limit: 60, windowMs: 60_000 }),
  state: createMemoryRateLimiter({ limit: 60, windowMs: 60_000 }),
  daily: createMemoryRateLimiter({ limit: 60, windowMs: 60_000 }),
  dailyGuess: createMemoryRateLimiter({ limit: 30, windowMs: 60_000 }),
  session: createMemoryRateLimiter({ limit: 120, windowMs: 60_000 }),
  login: createMemoryRateLimiter({ limit: 10, windowMs: 60_000 }),
  signup: createMemoryRateLimiter({ limit: 5, windowMs: 60_000 }),
  passwordReset: createMemoryRateLimiter({ limit: 5, windowMs: 60_000 }),
  passwordUpdate: createMemoryRateLimiter({ limit: 10, windowMs: 60_000 }),
  oauth: createMemoryRateLimiter({ limit: 20, windowMs: 60_000 }),
  logout: createMemoryRateLimiter({ limit: 20, windowMs: 60_000 }),
  username: createMemoryRateLimiter({ limit: 20, windowMs: 60_000 }),
  profile: createMemoryRateLimiter({ limit: 60, windowMs: 60_000 }),
  deleteAccount: createMemoryRateLimiter({ limit: 5, windowMs: 60_000 }),
};

/** Vercel sets x-real-ip itself and overwrites what the client sends. */
function clientAddress(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Logs what's needed to debug, and nothing that could hold personal data: only
 * these three fields, never `details` or the request. Postgres puts row values in
 * `details`, and our messages and codes don't contain emails or tokens.
 */
export function logServerError(context: string, error: unknown) {
  const { name, code, message } = (error ?? {}) as { name?: string; code?: string; message?: string };
  console.error(context, { name, code, message });
}

const MAX_BODY_BYTES = 2048;

/** A validated JSON body, or null if it's too big, malformed or fails the schema. */
export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.infer<T> | null> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    const result = schema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

const SAFE_METHODS = new Set(["GET", "HEAD"]);

/**
 * Wraps a route handler with CSRF protection, rate limiting and a catch-all, so
 * internal errors are logged on the server and never described to the client.
 */
export function guardedRoute(
  limiter: RateLimiter,
  handler: (request: Request) => Promise<NextResponse>,
) {
  return async (request: Request): Promise<NextResponse> => {
    // Marks the route as request-time, so it never runs during the build's prerender.
    await connection();
    try {
      if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
        return errorResponse("forbidden");
      }
      const { allowed, retryAfterSeconds } = limiter.check(clientAddress(request));
      if (!allowed) {
        return errorResponse("rate_limited", { "Retry-After": String(retryAfterSeconds) });
      }
      return await handler(request);
    } catch (error) {
      logServerError("API error:", error);
      return errorResponse(error instanceof AccountsUnavailableError ? "accounts_unavailable" : "server_error");
    }
  };
}
