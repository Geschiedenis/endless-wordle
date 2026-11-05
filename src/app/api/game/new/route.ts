import { createGame, toGameView } from "@/lib/game/engine";
import type { GameResponse } from "@/lib/game/types";
import { getCurrentUser } from "@/lib/server/auth";
import { getGameStore } from "@/lib/server/game-store";
import { guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";
import { newSeed, wordAt } from "@/lib/server/words";

/** Starts a new session, replacing any existing one. */
export const POST = guardedRoute(rateLimiters.new, async () => {
  const seed = newSeed();
  const state = createGame(seed, wordAt(seed, 0));
  await getGameStore(await getCurrentUser()).save(state);
  return jsonResponse<GameResponse>({ game: toGameView(state) });
});
