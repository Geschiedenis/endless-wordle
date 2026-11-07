import type { Locale } from "@/i18n/config";
import type { DailyGuessResponse, DailyResponse } from "./daily";
import type {
  ApiErrorCode,
  ApiErrorResponse,
  GameResponse,
  GuessResponse,
} from "./types";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorCode; message: string };

const FALLBACK_MESSAGE = "Something went wrong. Try again.";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, init);
    const body = (await response.json()) as T | ApiErrorResponse;
    if (response.ok) return { ok: true, data: body as T };
    const { error, message } = body as ApiErrorResponse;
    return { ok: false, error, message: message ?? FALLBACK_MESSAGE };
  } catch {
    return { ok: false, error: "server_error", message: FALLBACK_MESSAGE };
  }
}

/** Sends JSON with a state-changing method. */
export function apiSend<T>(path: string, method: "POST" | "PUT" | "DELETE", body?: unknown) {
  return apiRequest<T>(path, {
    method,
    ...(body === undefined
      ? {}
      : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
}

export const gameApi = {
  state: () => apiRequest<GameResponse>("/api/game/state"),
  newGame: (language: Locale) => apiSend<GameResponse>("/api/game/new", "POST", { language }),
  guess: (guess: string) => apiSend<GuessResponse>("/api/game/guess", "POST", { guess }),
};

export const dailyApi = {
  state: (language: Locale, day: string) =>
    apiRequest<DailyResponse>(`/api/daily?${new URLSearchParams({ language, day })}`),
  guess: (language: Locale, day: string, guess: string) =>
    apiSend<DailyGuessResponse>("/api/daily/guess", "POST", { language, day, guess }),
};
