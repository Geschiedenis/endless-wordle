import { z } from "zod";
import { LOCALES } from "@/i18n/config";
import { createGame, toGameView } from "@/lib/game/engine";
import type { GameResponse } from "@/lib/game/types";
import { getCurrentUser } from "@/lib/server/auth";
import { getGameStore } from "@/lib/server/game-store";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { ANSWERS, newSeed, wordAt } from "@/lib/server/words";

const bodySchema = z.strictObject({ language: z.enum(LOCALES).default("en") });

/** Starts a new session in the given language, replacing any existing one. */
export const POST = guardedRoute(rateLimiters.new, async (request) => {
  const body = await parseJsonBody(request, bodySchema);
  if (!body) return errorResponse("invalid_request");

  const seed = newSeed();
  const state = createGame(seed, wordAt(seed, 0, ANSWERS[body.language]), body.language);
  await getGameStore(await getCurrentUser()).save(state);
  return jsonResponse<GameResponse>({ game: toGameView(state) });
});
