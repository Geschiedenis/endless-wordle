import { computeFeedback, isSolved } from "./feedback";
import { guessesAllowed, rolloverBonus } from "./rollover";
import type { GameState, GameView, GuessResponse } from "./types";

/** Starts a session. The caller supplies randomness, keeping this pure. */
export function createGame(seed: string, answer: string): GameState {
  return { seed, answer, status: "playing", wordsSolved: 0, bonusGuesses: 0, guesses: [] };
}

export interface GuessOutcome {
  state: GameState;
  result: GuessResponse["result"];
}

/**
 * Applies a validated guess to a game in play and returns the new state.
 * nextAnswer is only called when the word is solved, with the number of words
 * solved so far (including this one).
 */
export function applyGuess(
  state: GameState,
  guess: string,
  nextAnswer: (wordsSolved: number) => string,
): GuessOutcome {
  if (state.status !== "playing") {
    throw new Error("Cannot guess in a finished game");
  }

  const feedback = computeFeedback(guess, state.answer);
  const guesses = [...state.guesses, guess];

  if (isSolved(feedback)) {
    const wordsSolved = state.wordsSolved + 1;
    const bonusEarned = rolloverBonus(state.bonusGuesses, guesses.length);
    return {
      state: {
        ...state,
        answer: nextAnswer(wordsSolved),
        wordsSolved,
        bonusGuesses: bonusEarned,
        guesses: [],
      },
      result: { word: guess, feedback, solved: true, bonusEarned },
    };
  }

  const outOfGuesses = guesses.length >= guessesAllowed(state.bonusGuesses);
  return {
    state: { ...state, guesses, status: outOfGuesses ? "lost" : "playing" },
    result: { word: guess, feedback, solved: false },
  };
}

/**
 * The only way game state reaches the browser. The answer is included solely
 * after a loss, and the seed never is.
 */
export function toGameView(state: GameState): GameView {
  const allowed = guessesAllowed(state.bonusGuesses);
  return {
    status: state.status,
    wordNumber: state.wordsSolved + 1,
    wordsSolved: state.wordsSolved,
    bonusGuesses: state.bonusGuesses,
    guessesAllowed: allowed,
    guessesRemaining: allowed - state.guesses.length,
    guesses: state.guesses.map((word) => ({
      word,
      feedback: computeFeedback(word, state.answer),
    })),
    ...(state.status === "lost" ? { answer: state.answer } : {}),
  };
}
