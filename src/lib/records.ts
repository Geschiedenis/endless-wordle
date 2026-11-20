/**
 * The player's best endless score per language, in this browser (localStorage), so
 * the game-over screen can celebrate a new record. Words differ per language, so each
 * language keeps its own record.
 */
import type { Locale } from "@/i18n/config";

const KEY = "ew-best";

function read(): Partial<Record<Locale, number>> {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

/** The best score so far in this language, before the game that just ended counts. */
export function bestScore(language: Locale): number {
  const best = read()[language];
  return typeof best === "number" && best >= 0 ? best : 0;
}

/** Stores a finished game's score if it beats the record. Safe to call more than once. */
export function saveScore(language: Locale, wordsSolved: number) {
  const records = read();
  if (wordsSolved <= (records[language] ?? 0)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...records, [language]: wordsSolved }));
  } catch {
    // Storage can be blocked. The record just isn't kept.
  }
}
