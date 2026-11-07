import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { isLocale } from "@/i18n/config";
import { guessesAllowed } from "@/lib/game/rollover";
import type { GameState } from "@/lib/game/types";

/**
 * Game state is sealed with AES-256-GCM rather than just signed. A signed value
 * is still readable, and the answer must not be readable in the browser's cookie
 * storage. GCM also authenticates, so a tampered token fails to open.
 */
const VERSION = "v1";
const IV_BYTES = 12;
const TAG_BYTES = 16;

function deriveKey(secret: string, purpose: string): Buffer {
  return createHash("sha256").update(`${purpose}:${VERSION}:${secret}`).digest();
}

/** Game tokens. The label is part of the key, so changing it would end every game in progress. */
const GAME_PURPOSE = "endless-wordle:game-token";

/** Encrypts any JSON value into a URL-safe token that expires after ttlSeconds. */
export function sealValue(
  value: unknown,
  purpose: string,
  secret: string,
  ttlSeconds: number,
  now: number = Date.now(),
): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(secret, purpose), iv);
  cipher.setAAD(Buffer.from(VERSION));
  const plaintext = JSON.stringify({ state: value, exp: now + ttlSeconds * 1000 });
  const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const sealed = Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
  return `${VERSION}.${sealed}`;
}

/**
 * Returns the value, or null for anything that isn't a current, untampered token
 * sealed for the same purpose. The caller still checks the value's shape.
 */
export function openValue(token: string, purpose: string, secret: string, now: number = Date.now()): unknown {
  const [version, sealed, ...rest] = token.split(".");
  if (version !== VERSION || !sealed || rest.length > 0) return null;

  try {
    const bytes = Buffer.from(sealed, "base64url");
    if (bytes.length <= IV_BYTES + TAG_BYTES) return null;
    const decipher = createDecipheriv("aes-256-gcm", deriveKey(secret, purpose), bytes.subarray(0, IV_BYTES));
    decipher.setAAD(Buffer.from(VERSION));
    decipher.setAuthTag(bytes.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));
    const plaintext = Buffer.concat([
      decipher.update(bytes.subarray(IV_BYTES + TAG_BYTES)),
      decipher.final(),
    ]).toString("utf8");

    const { state, exp } = JSON.parse(plaintext) as { state: unknown; exp: number };
    if (typeof exp !== "number" || exp <= now) return null;
    return state;
  } catch {
    return null;
  }
}

/** Encrypts game state into a URL-safe token that expires after ttlSeconds. */
export function sealGameState(
  state: GameState,
  secret: string,
  ttlSeconds: number,
  now: number = Date.now(),
): string {
  return sealValue(state, GAME_PURPOSE, secret, ttlSeconds, now);
}

/**
 * Returns the state, or null for anything that isn't a current, untampered token.
 * Callers treat null as "no game", so a bad token never becomes an error page.
 */
export function openGameState(
  token: string,
  secret: string,
  now: number = Date.now(),
): GameState | null {
  const state = openValue(token, GAME_PURPOSE, secret, now) as GameState | null;
  if (!state || typeof state !== "object" || !Array.isArray(state.guesses)) return null;
  if (!isUsableState(state)) return null;
  return {
    ...state,
    // Guest cookies from before V2 don't have totalGuesses, and games from before
    // languages existed are English.
    totalGuesses: state.totalGuesses ?? state.guesses.length,
    language: isLocale(state.language) ? state.language : "en",
    // Games from before the guess distribution don't know how long earlier words took.
    solvedIn: Array.isArray(state.solvedIn) ? state.solvedIn : [],
  };
}

/**
 * The highest bonus cap the game has ever had. The cap is now lower, but games
 * started before that may still carry more, and they should play out rather than
 * be thrown away. The next solved word rolls over under the current cap.
 */
const HIGHEST_BONUS_CAP_EVER = 6;

/**
 * Tokens from an older deploy can outlive a rules change. Only we can create
 * tokens, so this guards against our own past, not forgery.
 */
function isUsableState(state: GameState): boolean {
  return (
    state.bonusGuesses >= 0 &&
    state.bonusGuesses <= HIGHEST_BONUS_CAP_EVER &&
    state.guesses.length <= guessesAllowed(state.bonusGuesses)
  );
}
