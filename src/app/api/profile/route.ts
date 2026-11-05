import { cookies } from "next/headers";
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
  const [username, stats, games] = await Promise.all([
    getUsername(supabase, user.id),
    supabase
      .rpc("get_my_stats")
      .single<{ games_played: number | string; best_score: number; average_words: number | string }>(),
    supabase
      .from("games")
      .select("words_solved, total_guesses, created_at")
      .order("created_at", { ascending: false })
      .limit(RECENT_GAMES),
  ]);
  if (stats.error) throw stats.error;
  if (games.error) throw games.error;

  return jsonResponse<ProfileResponse>({
    username,
    stats: {
      gamesPlayed: Number(stats.data.games_played),
      bestScore: stats.data.best_score,
      averageWords: Number(stats.data.average_words),
    },
    recentGames: games.data.map((game) => ({
      wordsSolved: game.words_solved,
      totalGuesses: game.total_guesses,
      playedAt: game.created_at,
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
