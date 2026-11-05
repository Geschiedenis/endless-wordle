import type { Locale } from "@/i18n/config";
import { WORD_LENGTH } from "./constants";

/**
 * The letters each language plays with, and its keyboard. German keeps Ä, Ö and Ü
 * and Spanish keeps Ñ as letters of their own. Other accents are dropped, so É
 * counts as E, as in most Wordle versions for these languages.
 */
interface Language {
  letters: string;
  keyboard: readonly [string, string, string];
}

const LATIN = "abcdefghijklmnopqrstuvwxyz";
const QWERTY = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

export const LANGUAGES: Record<Locale, Language> = {
  en: { letters: LATIN, keyboard: QWERTY },
  nl: { letters: LATIN, keyboard: QWERTY },
  de: { letters: `${LATIN}äöü`, keyboard: ["qwertzuiopü", "asdfghjklöä", "yxcvbnm"] },
  fr: { letters: LATIN, keyboard: ["azertyuiop", "qsdfghjklm", "wxcvbn"] },
  es: { letters: `${LATIN}ñ`, keyboard: ["qwertyuiop", "asdfghjklñ", "zxcvbnm"] },
};

/**
 * Turns a typed character into a letter of the language, or null. "É" becomes "e".
 * Only characters that are a letter of the language, with or without an accent,
 * pass, which also keeps out lookalikes such as the Kelvin sign.
 */
export function normalizeLetter(locale: Locale, char: string): string | null {
  const { letters } = LANGUAGES[locale];
  if ([...char].length !== 1) return null;
  const lower = char.toLowerCase();
  if (letters.includes(lower) && letters.toUpperCase().includes(char.toUpperCase())) return lower;
  const base = lower.normalize("NFD").replace(/\p{M}/gu, "");
  return base.length === 1 && LATIN.includes(base) && /\p{L}/u.test(char) && base !== lower ? base : null;
}

/** Returns the guess in the language's letters, or null if it isn't five of them. */
export function parseGuess(value: unknown, locale: Locale): string | null {
  if (typeof value !== "string") return null;
  const chars = [...value.normalize("NFC")];
  if (chars.length !== WORD_LENGTH) return null;
  const letters = chars.map((char) => normalizeLetter(locale, char));
  return letters.every((letter) => letter !== null) ? letters.join("") : null;
}
