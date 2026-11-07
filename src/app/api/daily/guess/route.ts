import { z } from "zod";
import { LOCALES } from "@/i18n/config";
import { isPlayableDay, type DailyGuessResponse } from "@/lib/game/daily";
import { computeFeedback } from "@/lib/game/feedback";
import { parseGuess } from "@/lib/game/languages";
import { getCurrentUser } from "@/lib/server/auth";
import { dailyAnswer, dailyStatus, getDailyStore, toDailyView } from "@/lib/server/daily";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { isValidGuess } from "@/lib/server/words";

const bodySchema = z.strictObject({
  language: z.enum(LOCALES),
  day: z.string().max(10),
  guess: z.string().max(20),
});

/** A guess on the day's word. Once the word is solved or the guesses are gone, the day is over. */
export const POST = guardedRoute(rateLimiters.dailyGuess, async (request) => {
  const body = await parseJsonBody(request, bodySchema);
  if (!body || !isPlayableDay(body.day)) return errorResponse("invalid_request");
  const { language, day } = body;

  const guess = parseGuess(body.guess, language);
  if (!guess) return errorResponse("invalid_request");

  const store = getDailyStore(await getCurrentUser(), language, day);
  const earlier = await store.load();
  const answer = dailyAnswer(language, day);
  if (dailyStatus(earlier, answer) !== "playing") return errorResponse("game_over");

  // A rejected word doesn't use up a guess.
  if (!isValidGuess(guess, language)) return errorResponse("not_in_word_list");

  const guesses = [...earlier, guess];
  const solved = guess === answer;
  // Save first: this request's feedback is only revealed if its guess counted.
  if (!(await store.save(guesses, solved ? guesses.length : null))) return errorResponse("game_conflict");

  return jsonResponse<DailyGuessResponse>({
    result: { word: guess, feedback: computeFeedback(guess, answer), solved },
    daily: toDailyView(language, day, guesses, answer),
  });
});
