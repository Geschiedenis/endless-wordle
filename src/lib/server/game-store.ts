import "server-only";

import { cookies } from "next/headers";
import type { GameState } from "@/lib/game/types";
import type { User } from "./auth";
import { getGameSecret } from "./env";
import { createAdminClient } from "./supabase";
import { openGameState, sealGameState } from "./token";

/**
 * Where a game in progress lives. Route handlers only use this interface, and a
 * store lasts for one request.
 */
export interface GameStore {
  load(): Promise<GameState | null>;
  /**
   * Saves the state. Returns false if the game changed since load(), in which
   * case nothing was saved and the caller must not reveal this request's result.
   */
  save(state: GameState): Promise<boolean>;
}

const COOKIE_NAME = "ew_game";
const TTL_SECONDS = 60 * 60 * 24 * 30;

/**
 * Guests: state lives in an encrypted cookie, with no database involved. A player
 * could restore an old cookie for extra attempts, which is harmless because guest
 * games never reach the leaderboard.
 */
const cookieGameStore: GameStore = {
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
    return true;
  },
};

/**
 * Logged-in players: state lives in the database, because their scores are public.
 * The browser never holds it, so it can't be replayed. The revision check makes
 * each load-then-save atomic, so parallel requests can't each get a free guess
 * against the same state.
 */
function createDatabaseGameStore(userId: string): GameStore {
  const supabase = createAdminClient();
  let loadedRevision: number | null = null;

  return {
    async load() {
      const { data, error } = await supabase
        .from("active_games")
        .select("state, revision")
        .eq("user_id", userId)
        .maybeSingle<{ state: string; revision: number }>();
      if (error) throw error;
      if (!data) return null;
      loadedRevision = data.revision;
      return openGameState(data.state, getGameSecret());
    },

    async save(state) {
      const sealed = sealGameState(state, getGameSecret(), TTL_SECONDS);
      const updatedAt = new Date().toISOString();

      // Nothing loaded means this is a new game, which replaces any previous one.
      if (loadedRevision === null) {
        const { error } = await supabase
          .from("active_games")
          .upsert({ user_id: userId, state: sealed, revision: 0, updated_at: updatedAt });
        if (error) throw error;
        return true;
      }

      const { data, error } = await supabase
        .from("active_games")
        .update({ state: sealed, revision: loadedRevision + 1, updated_at: updatedAt })
        .eq("user_id", userId)
        .eq("revision", loadedRevision)
        .select("user_id");
      if (error) throw error;
      return data.length === 1;
    },
  };
}

export function getGameStore(user: User | null): GameStore {
  return user ? createDatabaseGameStore(user.id) : cookieGameStore;
}
