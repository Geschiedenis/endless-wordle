import "server-only";

import type { User } from "./auth";

export interface FinalScore {
  user: User | null;
  wordsSolved: number;
}

/**
 * V2 extension point: write to the highscores table. Called once, when a game
 * is lost. Before scores go public, move game state to a server-side GameStore,
 * because cookie state can be replayed (see the README).
 */
export async function recordFinalScore(score: FinalScore): Promise<void> {
  void score;
}
