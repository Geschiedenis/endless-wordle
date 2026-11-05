import { BASE_GUESSES, MAX_BONUS_GUESSES } from "./constants";

/** Guesses available on a word that starts with the given bonus. */
export function guessesAllowed(bonusGuesses: number): number {
  return BASE_GUESSES + bonusGuesses;
}

/**
 * Bonus carried into the next word: whatever was unused on the word just
 * solved, base and bonus guesses alike, up to the cap.
 *
 * Solving in 4 of 6 gives 2. Solving in 5 of 8 gives 3. Solving in 2 of 8
 * would give 6, capped to 3.
 */
export function rolloverBonus(
  bonusGuesses: number,
  guessesUsed: number,
  cap: number = MAX_BONUS_GUESSES,
): number {
  const unused = guessesAllowed(bonusGuesses) - guessesUsed;
  return Math.min(cap, Math.max(0, unused));
}
