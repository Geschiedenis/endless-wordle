import "server-only";

import { randomBytes } from "node:crypto";

const MIN_SECRET_LENGTH = 32;

const devStore = globalThis as typeof globalThis & { __endlessWordleDevSecret?: string };

/**
 * The key that protects game state. Read per call rather than at import, so
 * `next build` works without it. Production refuses to run on a missing or weak
 * secret. Development falls back to a throwaway one so `npm run dev` just works.
 */
export function getGameSecret(): string {
  const secret = process.env.GAME_SECRET;
  if (secret && secret.length >= MIN_SECRET_LENGTH) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(`GAME_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters`);
  }

  if (!devStore.__endlessWordleDevSecret) {
    devStore.__endlessWordleDevSecret = randomBytes(32).toString("base64url");
    console.warn("GAME_SECRET is not set: using a temporary development secret.");
  }
  return devStore.__endlessWordleDevSecret;
}

/** Thrown when Supabase isn't set up, so the routes can answer without crashing. */
export class AccountsUnavailableError extends Error {
  constructor(reason: string) {
    super(`Accounts are unavailable: ${reason}`);
    this.name = "AccountsUnavailableError";
  }
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new AccountsUnavailableError(`${name} is not set`);
  return value;
}

/**
 * True when accounts can work. Guest play never needs this, so `npm run dev`
 * works with no Supabase project. Production builds fail without the variables:
 * see next.config.ts.
 */
export function accountsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseConfig() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (new URL(url).pathname !== "/") {
    throw new AccountsUnavailableError("NEXT_PUBLIC_SUPABASE_URL must have no path, such as /rest/v1/");
  }
  return {
    url,
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}

export function getServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}
