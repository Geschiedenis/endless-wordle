import type { GameState } from "./types";

export interface FinalScore {
  wordsSolved: number;
  totalGuesses: number;
}

/**
 * The score of a finished game. It comes only from server-held game state, so
 * nothing a browser sends can change it.
 */
export function calculateFinalScore(state: GameState): FinalScore {
  if (state.status !== "lost") {
    throw new Error("Only a finished game has a final score");
  }
  return { wordsSolved: state.wordsSolved, totalGuesses: state.totalGuesses };
}
