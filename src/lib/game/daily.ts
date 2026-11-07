import type { Locale } from "@/i18n/config";
import type { ScoredGuess } from "./types";

/**
 * The daily word: one word a day per language, the same for everyone, in six guesses
 * with no bonus. Like Wordle, a day is the player's own calendar day, so the new word
 * arrives at their midnight.
 */

/** Daily word #1. */
export const DAILY_EPOCH = "2026-11-07";
export const DAILY_GUESSES = 6;

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type DailyStatus = "playing" | "solved" | "lost";

/** What the browser is allowed to know about a daily word. */
export interface DailyView {
  language: Locale;
  /** The player's calendar day, as YYYY-MM-DD. */
  day: string;
  /** Counts up from 1 on DAILY_EPOCH. */
  number: number;
  status: DailyStatus;
  guesses: ScoredGuess[];
  /** Only once the day's game is over. */
  answer?: string;
}

export interface DailyResponse {
  daily: DailyView;
}

export interface DailyGuessResponse extends DailyResponse {
  result: ScoredGuess & { solved: boolean };
}

/** The calendar day of a date in the browser's own time zone, as YYYY-MM-DD. */
export function localDay(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Midnight UTC of a YYYY-MM-DD day, or NaN for anything else. */
function dayStart(day: string): number {
  if (!DAY_PATTERN.test(day)) return NaN;
  const time = Date.parse(`${day}T00:00:00Z`);
  // Date.parse accepts days like 2026-02-31, which would round into March.
  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== day ? NaN : time;
}

export function dailyNumber(day: string): number {
  return Math.round((dayStart(day) - dayStart(DAILY_EPOCH)) / DAY_MS) + 1;
}

/**
 * Whether a day a browser sends could really be its today. Time zones run from 12
 * hours behind UTC to 14 ahead, so somewhere it's always yesterday, today or
 * tomorrow in UTC terms. Anything further away would let players look ahead.
 */
export function isPlayableDay(day: string, now: number = Date.now()): boolean {
  const start = dayStart(day);
  if (Number.isNaN(start) || start < dayStart(DAILY_EPOCH)) return false;
  const todayUtc = Math.floor(now / DAY_MS) * DAY_MS;
  return Math.abs(start - todayUtc) <= DAY_MS;
}

/** Milliseconds from a time until the next local midnight, when the next word arrives. */
export function msUntilNextDay(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}
