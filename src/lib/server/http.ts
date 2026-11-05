import "server-only";

import { connection, NextResponse } from "next/server";
import type { ApiErrorCode, ApiErrorResponse } from "@/lib/game/types";
import { createMemoryRateLimiter, type RateLimiter } from "./rate-limit";

const ERRORS: Record<ApiErrorCode, { status: number; message: string }> = {
  invalid_request: { status: 400, message: "Invalid request" },
  not_in_word_list: { status: 422, message: "Not in word list" },
  no_game: { status: 404, message: "No game in progress" },
  game_over: { status: 409, message: "This game has ended" },
  rate_limited: { status: 429, message: "Too many requests" },
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
 * Wraps a route handler with rate limiting and a catch-all, so internal errors
 * are logged on the server and never described to the client.
 */
export function guardedRoute(
  limiter: RateLimiter,
  handler: (request: Request) => Promise<NextResponse>,
) {
  return async (request: Request): Promise<NextResponse> => {
    // Marks the route as request-time, so it never runs during the build's prerender.
    await connection();
    try {
      const { allowed, retryAfterSeconds } = limiter.check(clientAddress(request));
      if (!allowed) {
        return errorResponse("rate_limited", { "Retry-After": String(retryAfterSeconds) });
      }
      return await handler(request);
    } catch (error) {
      console.error("Game API error:", error);
      return errorResponse("server_error");
    }
  };
}
