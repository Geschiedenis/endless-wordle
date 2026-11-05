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
  newGame: () => apiSend<GameResponse>("/api/game/new", "POST"),
  guess: (guess: string) => apiSend<GuessResponse>("/api/game/guess", "POST", { guess }),
};
