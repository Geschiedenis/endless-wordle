"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/game/api-client";
import { LEADERBOARD_LIMIT, type LeaderboardRange, type LeaderboardResponse } from "@/lib/leaderboard";
import { cn } from "@/lib/utils";

const RANGE_LABELS: Record<LeaderboardRange, string> = {
  all: "All-time",
  week: "This week",
  today: "Today",
};

type Board = { range: LeaderboardRange; data: LeaderboardResponse };

function fetchPage(range: LeaderboardRange, offset: number) {
  return apiRequest<LeaderboardResponse>(`/api/leaderboard?range=${range}&offset=${offset}`);
}

export function LeaderboardView() {
  const [range, setRange] = useState<LeaderboardRange>("all");
  const [board, setBoard] = useState<Board | null>(null);
  const [failedRange, setFailedRange] = useState<LeaderboardRange | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchPage(range, 0).then((response) => {
      if (!active) return;
      if (response.ok) {
        setBoard({ range, data: response.data });
        setFailedRange(null);
      } else {
        setFailedRange(range);
      }
    });
    return () => {
      active = false;
    };
  }, [range]);

  async function loadMore() {
    if (!board) return;
    setLoadingMore(true);
    const response = await fetchPage(board.range, board.data.entries.length);
    if (response.ok) {
      setBoard({
        range: board.range,
        data: { ...response.data, entries: [...board.data.entries, ...response.data.entries] },
      });
    }
    setLoadingMore(false);
  }

  // Keeps the old tab's scores off screen while the new one loads.
  const current = board?.range === range ? board.data : null;
  const meVisible = current?.entries.some((entry) => entry.isCurrentUser);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Each player&apos;s best game, top {LEADERBOARD_LIMIT}. Weeks start on Monday, and days and weeks
        reset at midnight UTC.
      </p>

      <Tabs
        value={range}
        onValueChange={(value) => setRange(value as LeaderboardRange)}
        className="mt-4"
      >
        <TabsList className="w-full">
          {(Object.keys(RANGE_LABELS) as LeaderboardRange[]).map((value) => (
            <TabsTrigger key={value} value={value}>
              {RANGE_LABELS[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div role="tabpanel" aria-label={`${RANGE_LABELS[range]} leaderboard`} className="mt-4">
        {failedRange === range ? (
          <p role="alert">The leaderboard couldn&apos;t load. Please try again.</p>
        ) : !current ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : current.entries.length === 0 ? (
          <p className="text-muted-foreground">No scores yet. Yours could be the first.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-muted-foreground">
                <tr>
                  <th scope="col" className="w-14 px-2 py-1.5 font-medium">Rank</th>
                  <th scope="col" className="px-2 py-1.5 font-medium">Player</th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">Words solved</th>
                </tr>
              </thead>
              <tbody>
                {current.entries.map((entry) => (
                  <tr
                    key={entry.username}
                    aria-current={entry.isCurrentUser ? "true" : undefined}
                    className={cn("border-t", entry.isCurrentUser && "bg-muted font-semibold")}
                  >
                    <td className="px-2 py-2 tabular-nums">{entry.rank}</td>
                    <td className="max-w-40 truncate px-2 py-2">
                      {entry.username}
                      {entry.isCurrentUser && " (you)"}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{entry.wordsSolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {current?.hasMore && (
          <Button
            variant="outline"
            disabled={loadingMore}
            onClick={() => void loadMore()}
            className="mt-4 h-10 w-full"
          >
            Load more
          </Button>
        )}

        {current?.me && !meVisible && (
          <p className="mt-4 rounded-md bg-muted px-3 py-2 font-semibold">
            Your rank: {current.me.rank}, with {current.me.wordsSolved}{" "}
            {current.me.wordsSolved === 1 ? "word" : "words"} solved
          </p>
        )}
      </div>
    </div>
  );
}
