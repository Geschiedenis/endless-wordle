import { BASE_GUESSES } from "./constants";

/**
 * Splits the guesses left on a word into regular and bonus ones, the way the board
 * shows them: the six regular rows come first, the bonus rows after. "5 +1" is five
 * regular guesses and one bonus guess still to use.
 */
export function splitGuessesLeft(guessesAllowed: number, guessesLeft: number): { regular: number; bonus: number } {
  const used = guessesAllowed - guessesLeft;
  const regular = Math.max(0, Math.min(guessesLeft, BASE_GUESSES - used));
  return { regular, bonus: guessesLeft - regular };
}
