/**
 * Shared between server and client. Nothing here may carry the answer except
 * GameView.answer, which only toGameView fills in, and only after a loss.
 */

export type LetterFeedback = "correct" | "present" | "absent";

export type GameStatus = "playing" | "lost";

/** Full game state. Server only: it contains the answer. */
export interface GameState {
  /** Random per-session value that decides the order of the words. */
  seed: string;
  answer: string;
  status: GameStatus;
  /** Words solved so far, which is also the score and the current streak. */
  wordsSolved: number;
  /** Bonus guesses added to the current word. */
  bonusGuesses: number;
  /** Guesses made on the current word, lowercase. */
  guesses: string[];
}

export interface ScoredGuess {
  word: string;
  feedback: LetterFeedback[];
}

/** What the browser is allowed to know about a game. */
export interface GameView {
  status: GameStatus;
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
}

export type ApiErrorCode =
  | "invalid_request"
  | "not_in_word_list"
  | "no_game"
  | "game_over"
  | "rate_limited"
  | "server_error";

export interface ApiErrorResponse {
  error: ApiErrorCode;
  message: string;
}
