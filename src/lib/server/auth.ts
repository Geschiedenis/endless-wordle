import "server-only";

import { cookies } from "next/headers";
import { accountsEnabled } from "./env";
import { createSessionClient, isSessionCookie } from "./supabase";

export interface User {
  id: string;
}

/**
 * The signed-in user, verified with Supabase. Guests have no session cookie, so
 * they return straight away and guest play never depends on Supabase being up.
 *
 * Throws if Supabase can't be reached. Treating that as "logged out" would
 * quietly move a player to a different game and lose their score.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  if (!accountsEnabled() || !cookieStore.getAll().some(({ name }) => isSessionCookie(name))) {
    return null;
  }

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    const rejected = error.status !== undefined && error.status >= 400 && error.status < 500;
    if (rejected) return null;
    throw error;
  }
  return data.user ? { id: data.user.id } : null;
}
