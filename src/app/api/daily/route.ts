import { z } from "zod";
import { LOCALES } from "@/i18n/config";
import { isPlayableDay, type DailyResponse } from "@/lib/game/daily";
import { getCurrentUser } from "@/lib/server/auth";
import { dailyAnswer, getDailyStore, toDailyView } from "@/lib/server/daily";
import { errorResponse, guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";

const querySchema = z.object({ language: z.enum(LOCALES), day: z.string().max(10) });

/** The player's progress on a day's word: nothing yet, under way, or done for the day. */
export const GET = guardedRoute(rateLimiters.daily, async (request) => {
  const params = new URL(request.url).searchParams;
  const query = querySchema.safeParse({ language: params.get("language"), day: params.get("day") });
  if (!query.success || !isPlayableDay(query.data.day)) return errorResponse("invalid_request");
  const { language, day } = query.data;

  const guesses = await getDailyStore(await getCurrentUser(), language, day).load();
  return jsonResponse<DailyResponse>({ daily: toDailyView(language, day, guesses, dailyAnswer(language, day)) });
});
