import "server-only";

import { randomBytes } from "node:crypto";

const MIN_SECRET_LENGTH = 32;

const devStore = globalThis as typeof globalThis & { __endlessWordleDevSecret?: string };

/**
 * The key that protects game cookies. Read per call rather than at import, so
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
