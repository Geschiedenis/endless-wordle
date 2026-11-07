import { cookies } from "next/headers";
import { isLocale } from "@/i18n/config";
import { BASE_GUESSES } from "@/lib/game/constants";
import { NO_USERNAME_CONFIRMATION, type ProfileResponse } from "@/lib/account-types";
import { getCurrentUser } from "@/lib/server/auth";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { getUsername } from "@/lib/server/profiles";
import { createAdminClient, createSessionClient, isSessionCookie } from "@/lib/server/supabase";
import { deleteAccountSchema } from "@/lib/validation";

const RECENT_GAMES = 20;

export const GET = guardedRoute(rateLimiters.profile, async () => {
  const user = await getCurrentUser();
  if (!user) return errorResponse("unauthorized");

  // The user's own session, so Row Level Security limits this to their rows.
  const supabase = await createSessionClient();
  const [username, stats, games, distribution] = await Promise.all([
    getUsername(supabase, user.id),
    supabase
      .rpc("get_my_stats")
      .single<{ games_played: number | string; best_score: number; average_words: number | string }>(),
    supabase
      .from("games")
      // Every column, so this keeps working before the language migration has run.
      .select("*")
      .order("created_at", { ascending: false })
      .limit(RECENT_GAMES),
    supabase.rpc("get_my_guess_distribution"),
  ]);
  if (stats.error) throw stats.error;
  if (games.error) throw games.error;
  // Until the daily migration has run, the function doesn't exist (PGRST202): show an empty chart.
  if (distribution.error && distribution.error.code !== "PGRST202") throw distribution.error;

  return jsonResponse<ProfileResponse>({
    username,
    stats: {
      gamesPlayed: Number(stats.data.games_played),
      bestScore: stats.data.best_score,
      averageWords: Number(stats.data.average_words),
    },
    guessDistribution: toDistribution((distribution.data ?? []) as DistributionRow[]),
    recentGames: games.data.map((game: { words_solved: number; total_guesses: number; created_at: string; language?: string }) => ({
      wordsSolved: game.words_solved,
      totalGuesses: game.total_guesses,
      playedAt: game.created_at,
      language: isLocale(game.language) ? game.language : "en",
    })),
  });
});

/** Deletes the account. All of the user's rows go with it, through cascading foreign keys. */
export const DELETE = guardedRoute(rateLimiters.deleteAccount, async (request) => {
  const user = await getCurrentUser();
  if (!user) return errorResponse("unauthorized");

  const body = await parseJsonBody(request, deleteAccountSchema);
  if (!body) return errorResponse("invalid_request");

  const username = await getUsername(await createSessionClient(), user.id);
  if (body.confirm !== (username ?? NO_USERNAME_CONFIRMATION)) return errorResponse("invalid_request");

  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) throw error;

  const cookieStore = await cookies();
  for (const { name } of cookieStore.getAll()) {
    if (isSessionCookie(name)) cookieStore.delete(name);
  }
  return jsonResponse({ ok: true });
});

type DistributionRow = { guesses: number; words: number | string };

/** One count per number of guesses, from 1 to at least 6, with gaps filled in as zero. */
function toDistribution(rows: DistributionRow[]): number[] {
  const longest = Math.max(BASE_GUESSES, ...rows.map((row) => row.guesses));
  const counts = Array.from({ length: longest }, () => 0);
  for (const row of rows) if (row.guesses >= 1) counts[row.guesses - 1] = Number(row.words);
  return counts;
}
