import "server-only";

import { after } from "next/server";
import type { Locale } from "@/i18n/config";
import { logServerError } from "./http";
import { createAdminClient } from "./supabase";

/**
 * Anonymous play statistics (the word_plays and game_plays tables): every finished
 * word and endless game, with nothing that identifies the player. Written after the
 * response is sent, so it never slows a guess down, and a failure only gets logged.
 */

export interface WordPlay {
  mode: "endless" | "daily";
  language: Locale;
  word: string;
  guesses: number;
  solved: boolean;
}

export interface GamePlay {
  language: Locale;
  words_solved: number;
  total_guesses: number;
}

export function recordWordPlay(play: WordPlay) {
  after(() => save("word_plays", () => createAdminClient().from("word_plays").insert(play)));
}

export function recordGamePlay(play: GamePlay) {
  after(() => save("game_plays", () => createAdminClient().from("game_plays").insert(play)));
}

async function save(table: string, insert: () => PromiseLike<{ error: { code?: string } | null }>) {
  try {
    const { error } = await insert();
    // Until the play_stats migration has run, the table doesn't exist (PGRST205): skip quietly.
    if (error && error.code !== "PGRST205") throw error;
  } catch (error) {
    logServerError(`Saving ${table} failed`, error);
  }
}
