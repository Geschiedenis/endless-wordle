import type {
  ApiErrorCode,
  ApiErrorResponse,
  GameResponse,
  GuessResponse,
} from "./types";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiErrorCode };

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, init);
    const body = (await response.json()) as T | ApiErrorResponse;
    if (response.ok) return { ok: true, data: body as T };
    return { ok: false, error: (body as ApiErrorResponse).error };
  } catch {
    return { ok: false, error: "server_error" };
  }
}

export const gameApi = {
  state: () => request<GameResponse>("/api/game/state"),
  newGame: () => request<GameResponse>("/api/game/new", { method: "POST" }),
  guess: (guess: string) =>
    request<GuessResponse>("/api/game/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    }),
};
