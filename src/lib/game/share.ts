import type { Locale } from "@/i18n/config";

/** Flag emoji for the share text, which goes to chat apps where emoji are expected. */
const FLAGS: Record<Locale, string> = { en: "🇺🇸", nl: "🇳🇱", de: "🇩🇪", fr: "🇫🇷", es: "🇪🇸" };

/** The most words listed one by one. Longer games show the latest ones. */
export const MAX_SHARED_WORDS = 10;

export interface SharedWord {
  /** Guesses used on the word, including the last. */
  guesses: number;
  solved: boolean;
}

/**
 * The text a player shares after a game, like the original Wordle's grid but one
 * line per word: a grey square per missed guess, then green for a solve or red for
 * the word that ended the game. No letters, so it never gives a word away.
 *
 *   Endless Wordle 🇳🇱 · 3 woorden
 *   ⬛⬛🟩
 *   ⬛⬛⬛⬛🟩
 *   ⬛🟩
 *   ⬛⬛⬛⬛⬛⬛⬛🟥
 *   https://endlesswordle.app/nl
 */
export function buildShareText({
  locale,
  wordsLabel,
  words,
  url,
  highContrast = false,
}: {
  locale: Locale;
  /** "3 words", already translated. */
  wordsLabel: string;
  /** Leave empty to share just the score, such as when the history isn't known. */
  words: readonly SharedWord[];
  url: string;
  /** Matches the high-contrast colours, as the original Wordle does. */
  highContrast?: boolean;
}): string {
  const solved = highContrast ? "🟧" : "🟩";
  const lines = words.slice(-MAX_SHARED_WORDS).map(({ guesses, solved: wasSolved }) =>
    wasSolved ? `${"⬛".repeat(Math.max(0, guesses - 1))}${solved}` : `${"⬛".repeat(Math.max(0, guesses - 1))}🟥`,
  );
  if (words.length > MAX_SHARED_WORDS) lines.unshift("⋯");
  return [`Endless Wordle ${FLAGS[locale]} · ${wordsLabel}`, ...lines, url].join("\n");
}
