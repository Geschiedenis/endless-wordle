import { NextResponse } from "next/server";
import { safeNextPath } from "@/lib/navigation";
import { guardedRoute, logServerError, rateLimiters } from "@/lib/server/http";
import { getUsername } from "@/lib/server/profiles";
import { createSessionClient } from "@/lib/server/supabase";

/** Where Google sign-in and the email links land. Turns the code into a session. */
export const GET = guardedRoute(rateLimiters.oauth, async (request) => {
  const url = new URL(request.url);
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const code = url.searchParams.get("code");
  if (!code) return redirectTo("/login?error=link");

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    logServerError("Auth callback failed", error);
    return redirectTo("/login?error=link");
  }

  const next = safeNextPath(url.searchParams.get("next"));
  if (next === "/reset-password") return redirectTo(next);

  const username = await getUsername(supabase, data.user.id);
  return redirectTo(username === null ? `/choose-username?next=${encodeURIComponent(next)}` : next);
});
