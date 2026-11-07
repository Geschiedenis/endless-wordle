import "server-only";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import type { Locale } from "@/i18n/config";
import { DAILY_GUESSES, dailyNumber, type DailyStatus, type DailyView } from "@/lib/game/daily";
import { computeFeedback } from "@/lib/game/feedback";
import type { User } from "./auth";
import { getGameSecret } from "./env";
import { createAdminClient } from "./supabase";
import { openValue, sealValue } from "./token";
import { ANSWERS, wordAt } from "./words";

/**
 * The day's word in a language. The order comes from a shuffle keyed with the game
 * secret, so the answer list in the repository doesn't give tomorrow's word away,
 * and it runs through the whole list before any word comes back.
 */
export function dailyAnswer(language: Locale, day: string, secret: string = getGameSecret()): string {
  const seed = createHmac("sha256", secret).update(`daily:${language}`).digest("base64url");
  return wordAt(seed, dailyNumber(day) - 1, ANSWERS[language]);
}

export function dailyStatus(guesses: readonly string[], answer: string): DailyStatus {
  if (guesses.at(-1) === answer) return "solved";
  return guesses.length >= DAILY_GUESSES ? "lost" : "playing";
}

/** The only way a daily word reaches the browser. The answer shows once the day is over for the player. */
export function toDailyView(language: Locale, day: string, guesses: readonly string[], answer: string): DailyView {
  const status = dailyStatus(guesses, answer);
  return {
    language,
    day,
    number: dailyNumber(day),
    status,
    guesses: guesses.map((word) => ({ word, feedback: computeFeedback(word, answer) })),
    ...(status === "playing" ? {} : { answer }),
  };
}

/** Where a player's guesses on a day's word are kept. A store lasts for one request. */
export interface DailyStore {
  load(): Promise<string[]>;
  /** Returns false if the guesses changed since load(), in which case nothing was saved. */
  save(guesses: string[], solvedIn: number | null): Promise<boolean>;
}

const PURPOSE = "endless-lingle:daily";
/** Long enough to cover the day in every time zone. */
const TTL_SECONDS = 60 * 60 * 24 * 3;

/**
 * Guests: an encrypted cookie per language, like Wordle keeps its game in the
 * browser. Clearing cookies starts the day over, which only affects that guest.
 */
function createCookieDailyStore(language: Locale, day: string): DailyStore {
  const name = `ew_daily_${language}`;
  return {
    async load() {
      const token = (await cookies()).get(name)?.value;
      const value = token ? openValue(token, PURPOSE, getGameSecret()) : null;
      if (!isStoredDay(value) || value.day !== day) return [];
      return value.guesses;
    },
    async save(guesses) {
      (await cookies()).set(name, sealValue({ day, guesses }, PURPOSE, getGameSecret(), TTL_SECONDS), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/daily",
        maxAge: TTL_SECONDS,
      });
      return true;
    },
  };
}

function isStoredDay(value: unknown): value is { day: string; guesses: string[] } {
  if (!value || typeof value !== "object") return false;
  const { day, guesses } = value as { day?: unknown; guesses?: unknown };
  return (
    typeof day === "string" &&
    Array.isArray(guesses) &&
    guesses.length <= DAILY_GUESSES &&
    guesses.every((guess) => typeof guess === "string")
  );
}

/**
 * Logged-in players: one row per day and language, so the word can't be played
 * again, not even on another device. The revision check stops parallel requests
 * from each getting a guess against the same state.
 */
function createDatabaseDailyStore(userId: string, language: Locale, day: string): DailyStore {
  const supabase = createAdminClient();
  let loadedRevision: number | null = null;

  return {
    async load() {
      const { data, error } = await supabase
        .from("daily_games")
        .select("guesses, revision")
        .eq("user_id", userId)
        .eq("day", day)
        .eq("language", language)
        .maybeSingle<{ guesses: string[]; revision: number }>();
      if (error) throw error;
      if (!data) return [];
      loadedRevision = data.revision;
      return data.guesses;
    },

    async save(guesses, solvedIn) {
      const row = { guesses, solved_in: solvedIn, updated_at: new Date().toISOString() };
      if (loadedRevision === null) {
        // A first guess. If another request got there first, this one loses.
        const { error } = await supabase
          .from("daily_games")
          .insert({ ...row, user_id: userId, day, language, revision: 0 });
        if (error?.code === "23505") return false;
        if (error) throw error;
        return true;
      }

      const { data, error } = await supabase
        .from("daily_games")
        .update({ ...row, revision: loadedRevision + 1 })
        .eq("user_id", userId)
        .eq("day", day)
        .eq("language", language)
        .eq("revision", loadedRevision)
        .select("user_id");
      if (error) throw error;
      return data.length === 1;
    },
  };
}

/** PostgREST's answer when a table doesn't exist, such as before its migration has run. */
const MISSING_TABLE = "PGRST205";

export function getDailyStore(user: User | null, language: Locale, day: string): DailyStore {
  const cookie = createCookieDailyStore(language, day);
  if (!user) return cookie;

  // Until the daily migration has run, logged-in players play like guests rather than not at all.
  const database = createDatabaseDailyStore(user.id, language, day);
  let store: DailyStore = database;
  return {
    async load() {
      try {
        return await database.load();
      } catch (error) {
        if ((error as { code?: string }).code !== MISSING_TABLE) throw error;
        store = cookie;
        return cookie.load();
      }
    },
    save: (guesses, solvedIn) => store.save(guesses, solvedIn),
  };
}
