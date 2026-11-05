import "server-only";

import { calculateFinalScore } from "@/lib/game/score";
import type { GameState } from "@/lib/game/types";
import type { User } from "./auth";
import { logServerError } from "./http";
import { createAdminClient } from "./supabase";

/**
 * Stores a logged-in player's finished game, from server-held state only.
 * Called once per game: the revision check in the game store lets only one
 * request finish a game. A storage failure must not break the game-over screen,
 * so it reports false instead of throwing.
 */
export async function recordFinalScore(user: User, state: GameState): Promise<boolean> {
  try {
    const { wordsSolved, totalGuesses } = calculateFinalScore(state);
    const row = { user_id: user.id, words_solved: wordsSolved, total_guesses: totalGuesses };
    const games = createAdminClient().from("games");
    let { error } = await games.insert({ ...row, language: state.language });
    // Until the language migration has run, the column doesn't exist yet. The score
    // still counts, so it's saved without one rather than lost.
    if (error?.code === "PGRST204") ({ error } = await games.insert(row));
    if (error) throw error;
    return true;
  } catch (error) {
    logServerError("Saving a score failed", error);
    return false;
  }
}
