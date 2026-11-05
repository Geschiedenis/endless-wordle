import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getServiceRoleKey, getSupabaseConfig } from "./env";

/**
 * Sessions live in httpOnly cookies, so the browser never holds a token and all
 * Supabase calls go through route handlers. That's why this app has no browser
 * Supabase client.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

/** Supabase names its cookies sb-<project>-auth-token, split as .0, .1 when long. */
export function isSessionCookie(name: string): boolean {
  return name.startsWith("sb-") && !name.includes("code-verifier");
}

/** Acts as the signed-in user, so Row Level Security applies. */
export async function createSessionClient() {
  const { url, anonKey } = getSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookieOptions: SESSION_COOKIE_OPTIONS,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

/** Acts as nobody in particular: what a guest may read. */
export function createAnonClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Bypasses Row Level Security. Server only: the "server-only" import above makes
 * the build fail if client code ever pulls this in.
 */
export function createAdminClient() {
  const { url } = getSupabaseConfig();
  return createClient(url, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
