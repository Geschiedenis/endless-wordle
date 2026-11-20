import "server-only";

import { cacheLife } from "next/cache";
import type { Locale } from "@/i18n/config";
import { DAILY_GUESSES, dailyDay } from "@/lib/game/daily";
import { dailyAnswer } from "./daily";
import { logServerError } from "./http";
import { createAdminClient } from "./supabase";

/** How players did on one daily word, from the anonymous play statistics (word_plays). */
export interface DailyWordStats {
  plays: number;
  solved: number;
  /** Solved words by guesses: index 0 is solved in 1. */
  distribution: number[];
  /** Average guesses of the players who solved it, or null if nobody did. */
  averageGuesses: number | null;
}

/** Below this many players a day shows no statistics: a handful of games says little. */
export const MIN_PLAYS_FOR_STATS = 3;

/**
 * Statistics for a past daily word. A daily word comes back only after the whole list,
 * so the word identifies its day. Cached for an hour: the archive only shows days that
 * are over, so the numbers barely change. Null if the statistics can't be read.
 */
export async function dailyWordStats(language: Locale, word: string): Promise<DailyWordStats | null> {
  "use cache";
  cacheLife("hours");
  try {
    const { data, error } = await createAdminClient()
      .from("word_plays")
      .select("guesses, solved")
      .eq("mode", "daily")
      .eq("language", language)
      .eq("word", word)
      .limit(50_000);
    if (error) throw error;
    const rows = (data ?? []) as { guesses: number; solved: boolean }[];
    const distribution = Array.from({ length: DAILY_GUESSES }, () => 0);
    let solved = 0;
    let guessTotal = 0;
    for (const { guesses, solved: won } of rows) {
      if (!won) continue;
      solved++;
      guessTotal += guesses;
      if (guesses >= 1 && guesses <= DAILY_GUESSES) distribution[guesses - 1]++;
    }
    return { plays: rows.length, solved, distribution, averageGuesses: solved ? guessTotal / solved : null };
  } catch (error) {
    logServerError("Reading daily word statistics failed", error);
    return null;
  }
}

export interface ArchiveEntry {
  number: number;
  /** YYYY-MM-DD */
  day: string;
  word: string;
}

/**
 * Daily words 1 to upTo, newest first. Working out a word hashes the whole answer
 * list, so the list is cached; upTo is part of the key, so a new day adds a new entry.
 */
export async function archiveEntries(language: Locale, upTo: number): Promise<ArchiveEntry[]> {
  "use cache";
  cacheLife("days");
  const entries: ArchiveEntry[] = [];
  for (let number = upTo; number >= 1; number--) {
    const day = dailyDay(number);
    entries.push({ number, day, word: dailyAnswer(language, day) });
  }
  return entries;
}
