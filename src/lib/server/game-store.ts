import "server-only";

import { cookies } from "next/headers";
import type { GameState } from "@/lib/game/types";
import { getGameSecret } from "./env";
import { openGameState, sealGameState } from "./token";

/**
 * Where a game in progress lives. Route handlers only use this interface.
 *
 * V2: implement it on the database, keyed by a session or user id, to get
 * server-side state. That also closes the replay gap described in the README,
 * which matters as soon as scores are public.
 */
export interface GameStore {
  load(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
}

const COOKIE_NAME = "ew_game";
const TTL_SECONDS = 60 * 60 * 24 * 30;

export const cookieGameStore: GameStore = {
  async load() {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    return token ? openGameState(token, getGameSecret()) : null;
  },

  async save(state) {
    (await cookies()).set(COOKIE_NAME, sealGameState(state, getGameSecret(), TTL_SECONDS), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/game",
      maxAge: TTL_SECONDS,
    });
  },
};

/** The active store. V2 can switch implementation here. */
export function getGameStore(): GameStore {
  return cookieGameStore;
}
