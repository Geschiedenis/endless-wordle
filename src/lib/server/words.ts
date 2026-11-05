import "server-only";

import { createHash, randomBytes } from "node:crypto";
import answers from "../../../data/answers.json";
import validGuesses from "../../../data/valid-guesses.json";

const validGuessSet = new Set<string>(validGuesses);

export function isValidGuess(word: string): boolean {
  return validGuessSet.has(word);
}

export function newSeed(): string {
  return randomBytes(16).toString("base64url");
}

/**
 * The word at a position in a session. Each session sees the list in its own
 * shuffled order, sorted by a hash keyed with the seed, so nothing repeats and
 * the token never has to carry a growing list of used words. If someone solves
 * the entire list, the next cycle reshuffles it.
 */
export function wordAt(
  seed: string,
  position: number,
  list: readonly string[] = answers,
): string {
  const cycle = Math.floor(position / list.length);
  const shuffled = list
    .map((word) => ({
      word,
      key: createHash("sha256").update(`${seed}:${cycle}:${word}`).digest("hex"),
    }))
    .sort((a, b) => (a.key < b.key ? -1 : 1));
  return shuffled[position % list.length].word;
}
