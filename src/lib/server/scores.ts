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
    const { wordsSolved, totalGuesses, solvedIn } = calculateFinalScore(state);
    const row = { user_id: user.id, words_solved: wordsSolved, total_guesses: totalGuesses };
    const games = createAdminClient().from("games");
    // Newest columns first. Until a migration has run, its column doesn't exist yet
    // (PGRST204). The score still counts, so it's saved without that column rather than lost.
    const attempts = [
      { ...row, language: state.language, solved_in: solvedIn },
      { ...row, language: state.language },
      row,
    ];
    let error: { code?: string } | null = null;
    for (const attempt of attempts) {
      ({ error } = await games.insert(attempt));
      if (error?.code !== "PGRST204") break;
    }
    if (error) throw error;
    return true;
  } catch (error) {
    logServerError("Saving a score failed", error);
    return false;
  }
}
