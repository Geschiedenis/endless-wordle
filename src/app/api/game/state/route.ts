import { toGameView } from "@/lib/game/engine";
import type { GameResponse } from "@/lib/game/types";
import { getGameStore } from "@/lib/server/game-store";
import { errorResponse, guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";

/** Returns the game in progress, so a page reload picks up where it left off. */
export const GET = guardedRoute(rateLimiters.state, async () => {
  const state = await getGameStore().load();
  if (!state) return errorResponse("no_game");
  return jsonResponse<GameResponse>({ game: toGameView(state) });
});
