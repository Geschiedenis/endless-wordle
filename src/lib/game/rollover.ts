import { BASE_GUESSES, MAX_BONUS_GUESSES } from "./constants";

/** Guesses available on a word that starts with the given bonus. */
export function guessesAllowed(bonusGuesses: number): number {
  return BASE_GUESSES + bonusGuesses;
}

/**
 * Bonus carried into the next word: whatever was unused on the word just
 * solved, base and bonus guesses alike, up to the cap.
 *
 * Solving in 4 of 6 gives 2. Solving in 4 of 8 gives 4. Solving in 3 of 12
 * would give 9, capped to 6.
 */
export function rolloverBonus(
  bonusGuesses: number,
  guessesUsed: number,
  cap: number = MAX_BONUS_GUESSES,
): number {
  const unused = guessesAllowed(bonusGuesses) - guessesUsed;
  return Math.min(cap, Math.max(0, unused));
}
