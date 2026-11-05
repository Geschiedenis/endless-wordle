import { WORD_LENGTH } from "./constants";

const GUESS_PATTERN = new RegExp(`^[A-Za-z]{${WORD_LENGTH}}$`);

/**
 * Returns the guess in lowercase, or null if it isn't exactly five letters A-Z.
 * The shape is checked before lowercasing, because toLowerCase maps some
 * non-ASCII characters to ASCII (the Kelvin sign becomes "k").
 */
export function parseGuess(value: unknown): string | null {
  if (typeof value !== "string" || !GUESS_PATTERN.test(value)) return null;
  return value.toLowerCase();
}
