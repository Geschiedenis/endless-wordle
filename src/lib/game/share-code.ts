import type { SharedWord } from "./share";

/**
 * The result in a share link, as short as possible and without any letters:
 * one digit per solved word (guesses used), a dash, then the guesses on the word
 * that ended the game. "315-6" is three words solved in 3, 1 and 5 guesses, then
 * a loss after 6. When the words aren't known, such as after a reload, it's just
 * the score: "n12".
 *
 * Anyone can type a link, so the result is a claim, not a proof. It only ever says
 * what the link says, and never touches saved scores.
 */
export interface SharedResult {
  wordsSolved: number;
  /** Empty when only the score is known. */
  words: SharedWord[];
}

/** Guesses on one word can't be more than 6 plus the highest bonus, which fits a digit. */
const MAX_GUESSES = 9;
const MAX_WORDS = 999;

export function encodeResult({ wordsSolved, words }: SharedResult): string {
  const solved = words.filter((word) => word.solved);
  const lost = words.find((word) => !word.solved);
  if (words.length === 0 || !lost || solved.length !== wordsSolved) return `n${Math.min(wordsSolved, MAX_WORDS)}`;
  return `${solved.map((word) => word.guesses).join("")}-${lost.guesses}`;
}

/** Null for anything that isn't a well-formed code. */
export function decodeResult(code: string): SharedResult | null {
  const scoreOnly = /^n(\d{1,3})$/.exec(code);
  if (scoreOnly) return { wordsSolved: Number(scoreOnly[1]), words: [] };

  const full = new RegExp(`^([1-${MAX_GUESSES}]{0,${MAX_WORDS}})-([1-${MAX_GUESSES}])$`).exec(code);
  if (!full) return null;
  const words: SharedWord[] = [...full[1]].map((digit) => ({ guesses: Number(digit), solved: true }));
  words.push({ guesses: Number(full[2]), solved: false });
  return { wordsSolved: words.length - 1, words };
}
