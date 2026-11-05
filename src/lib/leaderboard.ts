export const LEADERBOARD_RANGES = ["all", "week", "today"] as const;
export type LeaderboardRange = (typeof LEADERBOARD_RANGES)[number];

export const LEADERBOARD_LIMIT = 50;
export const LEADERBOARD_PAGE_SIZE = 25;

export interface LeaderboardEntry {
  rank: number;
  username: string;
  wordsSolved: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  hasMore: boolean;
  /** The viewer's own rank in this range, if logged in and ranked. */
  me: { rank: number; wordsSolved: number } | null;
}

/** Row as returned by the get_leaderboard database function. */
export interface LeaderboardRow {
  rank: number | string;
  username: string;
  words_solved: number;
}

/** How many rows to ask for: one extra reveals whether another page exists. */
export function leaderboardFetchSize(): number {
  return LEADERBOARD_PAGE_SIZE + 1;
}

export function toLeaderboardPage(
  rows: readonly LeaderboardRow[],
  offset: number,
  currentUsername: string | null,
): Pick<LeaderboardResponse, "entries" | "hasMore"> {
  const entries = rows.slice(0, LEADERBOARD_PAGE_SIZE).map((row) => ({
    rank: Number(row.rank),
    username: row.username,
    wordsSolved: row.words_solved,
    isCurrentUser: currentUsername !== null && row.username === currentUsername,
  }));
  return {
    entries,
    hasMore: rows.length > LEADERBOARD_PAGE_SIZE && offset + entries.length < LEADERBOARD_LIMIT,
  };
}
