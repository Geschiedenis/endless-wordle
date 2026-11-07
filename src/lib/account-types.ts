import type { Locale } from "@/i18n/config";

/** Account data the API sends to the browser. Never includes email or user ids. */

export type SessionResponse =
  | { user: { username: string | null }; accountsEnabled: true }
  | { user: null; accountsEnabled: boolean };

export interface LoginResponse {
  needsUsername: boolean;
}

export interface SignupResponse {
  /** "confirm_email" is also the answer for an address already in use, so sign-up can't reveal who has an account. */
  status: "confirm_email" | "signed_in";
}

export interface RecentGame {
  language: Locale;
  wordsSolved: number;
  totalGuesses: number;
  playedAt: string;
}

export interface ProfileResponse {
  username: string | null;
  stats: { gamesPlayed: number; bestScore: number; averageWords: number };
  /**
   * Solved words by the guesses they took, from 1 up to at least 6, across endless
   * games and daily words. Index 0 is one guess.
   */
  guessDistribution: number[];
  recentGames: RecentGame[];
}

/** What to type to delete an account that has no username yet. */
export const NO_USERNAME_CONFIRMATION = "delete";
