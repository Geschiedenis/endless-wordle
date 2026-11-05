import { describe, expect, it } from "vitest";
import {
  LEADERBOARD_PAGE_SIZE,
  leaderboardFetchSize,
  toLeaderboardPage,
  type LeaderboardRow,
} from "./leaderboard";
import { leaderboardQuerySchema } from "./validation";

const rows = (count: number): LeaderboardRow[] =>
  Array.from({ length: count }, (_, i) => ({ rank: String(i + 1), username: `p${i}`, words_solved: 100 - i }));

describe("toLeaderboardPage", () => {
  it("maps database rows, turning a bigint string rank into a number", () => {
    expect(toLeaderboardPage(rows(1), 0, null).entries).toEqual([
      { rank: 1, username: "p0", wordsSolved: 100, isCurrentUser: false },
    ]);
  });

  it("marks only the current user's row", () => {
    const { entries } = toLeaderboardPage(rows(3), 0, "p1");
    expect(entries.map((entry) => entry.isCurrentUser)).toEqual([false, true, false]);
  });

  it("doesn't match anyone for a guest", () => {
    expect(toLeaderboardPage(rows(3), 0, null).entries.some((entry) => entry.isCurrentUser)).toBe(false);
  });

  it("uses the extra row to detect another page, without showing it", () => {
    const page = toLeaderboardPage(rows(leaderboardFetchSize()), 0, null);
    expect(page.entries).toHaveLength(LEADERBOARD_PAGE_SIZE);
    expect(page.hasMore).toBe(true);
  });

  it("reports no more when the page isn't over-full", () => {
    expect(toLeaderboardPage(rows(LEADERBOARD_PAGE_SIZE), 0, null).hasMore).toBe(false);
  });

  it("stops at the top 50", () => {
    expect(toLeaderboardPage(rows(leaderboardFetchSize()), 25, null).hasMore).toBe(false);
  });
});

describe("leaderboardQuerySchema", () => {
  it("applies defaults", () => {
    expect(leaderboardQuerySchema.parse({})).toEqual({ range: "all", offset: 0 });
  });

  it("coerces a query string offset", () => {
    expect(leaderboardQuerySchema.parse({ range: "week", offset: "25" })).toEqual({ range: "week", offset: 25 });
  });

  it.each([
    { range: "forever" },
    { range: "all'; drop table games;--" },
    { offset: "-1" },
    { offset: "51" },
    { offset: "1.5" },
    { offset: "abc" },
  ])("rejects %j", (query) => {
    expect(leaderboardQuerySchema.safeParse(query).success).toBe(false);
  });
});
