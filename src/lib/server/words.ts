import "server-only";

import { createHash, randomBytes } from "node:crypto";
import type { Locale } from "@/i18n/config";
import deAnswers from "../../../data/de/answers.json";
import deGuesses from "../../../data/de/valid-guesses.json";
import enAnswers from "../../../data/en/answers.json";
import enGuesses from "../../../data/en/valid-guesses.json";
import esAnswers from "../../../data/es/answers.json";
import esGuesses from "../../../data/es/valid-guesses.json";
import frAnswers from "../../../data/fr/answers.json";
import frGuesses from "../../../data/fr/valid-guesses.json";
import nlAnswers from "../../../data/nl/answers.json";
import nlGuesses from "../../../data/nl/valid-guesses.json";

/** Answers per language. Server only, so the browser never sees them. */
export const ANSWERS: Record<Locale, readonly string[]> = {
  en: enAnswers,
  nl: nlAnswers,
  de: deAnswers,
  fr: frAnswers,
  es: esAnswers,
};

const VALID_GUESSES: Record<Locale, ReadonlySet<string>> = {
  en: new Set(enGuesses),
  nl: new Set(nlGuesses),
  de: new Set(deGuesses),
  fr: new Set(frGuesses),
  es: new Set(esGuesses),
};

export function isValidGuess(word: string, language: Locale = "en"): boolean {
  return VALID_GUESSES[language].has(word);
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
  list: readonly string[] = ANSWERS.en,
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
