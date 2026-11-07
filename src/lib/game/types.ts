/**
 * Shared between server and client. Nothing here may carry the answer except
 * GameView.answer, which only toGameView fills in, and only after a loss.
 */

import type { Locale } from "@/i18n/config";

export type LetterFeedback = "correct" | "present" | "absent";

export type GameStatus = "playing" | "lost";

/** Full game state. Server only: it contains the answer. */
export interface GameState {
  /** Random per-session value that decides the order of the words. */
  seed: string;
  /** Which word lists the game uses. Fixed for the whole game. */
  language: Locale;
  answer: string;
  status: GameStatus;
  /** Words solved so far, which is also the score and the current streak. */
  wordsSolved: number;
  /** Bonus guesses added to the current word. */
  bonusGuesses: number;
  /** Guesses made on the current word, lowercase. */
  guesses: string[];
  /** Guesses made across every word in this game. */
  totalGuesses: number;
  /** Guesses each solved word took, in order. For the guess distribution on the profile. */
  solvedIn: number[];
}

export interface ScoredGuess {
  word: string;
  feedback: LetterFeedback[];
}

/** A finished word that stays on the board above the one being played. */
export interface SolvedWord {
  wordNumber: number;
  guesses: ScoredGuess[];
}

/** What the browser is allowed to know about a game. */
export interface GameView {
  status: GameStatus;
  language: Locale;
  wordNumber: number;
  wordsSolved: number;
  bonusGuesses: number;
  guessesAllowed: number;
  guessesRemaining: number;
  guesses: ScoredGuess[];
  /** Only present once the game is lost. */
  answer?: string;
}

export interface GameResponse {
  game: GameView;
}

export interface GuessResponse extends GameResponse {
  /** The guess just made. Needed because a solved word resets game.guesses. */
  result: ScoredGuess & {
    solved: boolean;
    /** Bonus guesses carried into the next word. Only set when solved. */
    bonusEarned?: number;
  };
  /** Only set when a logged-in player's game ends: whether the score was stored. */
  scoreSaved?: boolean;
}

export type ApiErrorCode =
  | "invalid_request"
  | "not_in_word_list"
  | "no_game"
  | "game_over"
  | "game_conflict"
  | "rate_limited"
  | "forbidden"
  | "unauthorized"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "weak_password"
  | "username_unavailable"
  | "accounts_unavailable"
  | "server_error";

export interface ApiErrorResponse {
  error: ApiErrorCode;
  message: string;
}
