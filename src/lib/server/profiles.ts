import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient, createSessionClient } from "./supabase";

/** The user's username, or null if they haven't chosen one yet. */
export async function getUsername(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle<{ username: string }>();
  if (error) throw error;
  return data?.username ?? null;
}

/** Postgres codes for a taken name (unique) and a rejected one (the rules trigger). */
const UNAVAILABLE_CODES = new Set(["23505", "23514"]);

/**
 * Sets the username, and returns false if it isn't available. Only the service
 * role can create a profile. Changing one goes through the user's own session,
 * so Row Level Security still applies.
 */
export async function saveUsername(userId: string, username: string): Promise<boolean> {
  const session = await createSessionClient();
  const hasProfile = (await getUsername(session, userId)) !== null;

  const { error } = hasProfile
    ? await session.from("profiles").update({ username }).eq("id", userId)
    : await createAdminClient().from("profiles").insert({ id: userId, username });

  if (!error) return true;
  if (UNAVAILABLE_CODES.has(error.code)) return false;
  throw error;
}
