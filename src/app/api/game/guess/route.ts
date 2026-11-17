import { applyGuess, toGameView } from "@/lib/game/engine";
import type { GuessResponse } from "@/lib/game/types";
import { parseGuess } from "@/lib/game/languages";
import { getCurrentUser } from "@/lib/server/auth";
import { getGameStore } from "@/lib/server/game-store";
import { errorResponse, guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";
import { recordGamePlay, recordWordPlay } from "@/lib/server/play-stats";
import { recordFinalScore } from "@/lib/server/scores";
import { ANSWERS, isValidGuess, wordAt } from "@/lib/server/words";

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
  const rawGuess = await readGuess(request);

  const user = await getCurrentUser();
  const store = getGameStore(user);
  const state = await store.load();
  if (!state) return errorResponse("no_game");

  // Which letters count depends on the game's language.
  const guess = parseGuess(rawGuess, state.language);
  if (!guess) return errorResponse("invalid_request");
  if (state.status !== "playing") return errorResponse("game_over");

  // A rejected word doesn't change the game or use up a guess.
  if (!isValidGuess(guess, state.language)) return errorResponse("not_in_word_list");

  const outcome = applyGuess(state, guess, (wordsSolved) =>
    wordAt(state.seed, wordsSolved, ANSWERS[state.language]),
  );

  // Save first: this request's feedback is only revealed if its guess counted.
  if (!(await store.save(outcome.state))) return errorResponse("game_conflict");

  // Anonymous statistics, for every player: the finished word, and the game once it ends.
  const next = outcome.state;
  if (outcome.result.solved) {
    recordWordPlay({ mode: "endless", language: next.language, word: guess, guesses: next.solvedIn.at(-1) ?? 0, solved: true });
  } else if (next.status === "lost") {
    recordWordPlay({ mode: "endless", language: next.language, word: next.answer, guesses: next.guesses.length, solved: false });
    recordGamePlay({ language: next.language, words_solved: next.wordsSolved, total_guesses: next.totalGuesses });
  }

  const scoreSaved =
    user && outcome.state.status === "lost" ? await recordFinalScore(user, outcome.state) : undefined;

  return jsonResponse<GuessResponse>({
    result: outcome.result,
    game: toGameView(outcome.state),
    ...(scoreSaved === undefined ? {} : { scoreSaved }),
  });
});
