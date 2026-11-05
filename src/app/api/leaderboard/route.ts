import {
  leaderboardFetchSize,
  toLeaderboardPage,
  type LeaderboardResponse,
  type LeaderboardRow,
} from "@/lib/leaderboard";
import { getCurrentUser } from "@/lib/server/auth";
import { errorResponse, guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";
import { getUsername } from "@/lib/server/profiles";
import { createAnonClient, createSessionClient } from "@/lib/server/supabase";
import { leaderboardQuerySchema } from "@/lib/validation";

export const GET = guardedRoute(rateLimiters.leaderboard, async (request) => {
  const query = leaderboardQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!query.success) return errorResponse("invalid_request");
  const { range, offset } = query.data;

  // The anonymous client: the board shows everyone the same public data.
  const { data, error } = await createAnonClient().rpc("get_leaderboard", {
    p_range: range,
    p_limit: leaderboardFetchSize(),
    p_offset: offset,
  });
  if (error) throw error;

  let username: string | null = null;
  let me: LeaderboardResponse["me"] = null;

  const user = await getCurrentUser();
  if (user) {
    const session = await createSessionClient();
    username = await getUsername(session, user.id);
    const rank = await session
      .rpc("get_my_rank", { p_range: range })
      .maybeSingle<{ rank: number | string; words_solved: number }>();
    if (rank.error) throw rank.error;
    if (rank.data && username) me = { rank: Number(rank.data.rank), wordsSolved: rank.data.words_solved };
  }

  return jsonResponse<LeaderboardResponse>({
    ...toLeaderboardPage(data as LeaderboardRow[], offset, username),
    me,
  });
});
