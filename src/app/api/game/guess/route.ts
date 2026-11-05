import { applyGuess, toGameView } from "@/lib/game/engine";
import type { GuessResponse } from "@/lib/game/types";
import { parseGuess } from "@/lib/game/validation";
import { getCurrentUser } from "@/lib/server/auth";
import { getGameStore } from "@/lib/server/game-store";
import { errorResponse, guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";
import { recordFinalScore } from "@/lib/server/scores";
import { isValidGuess, wordAt } from "@/lib/server/words";

const MAX_BODY_BYTES = 256;

async function readGuess(request: Request): Promise<unknown> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    return (JSON.parse(text) as { guess?: unknown } | null)?.guess ?? null;
  } catch {
    return null;
  }
}

export const POST = guardedRoute(rateLimiters.guess, async (request) => {
  const guess = parseGuess(await readGuess(request));
  if (!guess) return errorResponse("invalid_request");

  const user = await getCurrentUser();
  const store = getGameStore(user);
  const state = await store.load();
  if (!state) return errorResponse("no_game");
  if (state.status !== "playing") return errorResponse("game_over");

  // A rejected word doesn't change the game or use up a guess.
  if (!isValidGuess(guess)) return errorResponse("not_in_word_list");

  const outcome = applyGuess(state, guess, (wordsSolved) => wordAt(state.seed, wordsSolved));

  // Save first: this request's feedback is only revealed if its guess counted.
  if (!(await store.save(outcome.state))) return errorResponse("game_conflict");

  const scoreSaved =
    user && outcome.state.status === "lost" ? await recordFinalScore(user, outcome.state) : undefined;

  return jsonResponse<GuessResponse>({
    result: outcome.result,
    game: toGameView(outcome.state),
    ...(scoreSaved === undefined ? {} : { scoreSaved }),
  });
});
