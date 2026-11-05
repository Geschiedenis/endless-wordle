import type { SessionResponse } from "@/lib/account-types";
import { getCurrentUser } from "@/lib/server/auth";
import { accountsEnabled } from "@/lib/server/env";
import { guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";
import { getUsername } from "@/lib/server/profiles";
import { createSessionClient } from "@/lib/server/supabase";

/** Who is logged in, for the header. Sessions are in httpOnly cookies, so the page can't tell by itself. */
export const GET = guardedRoute(rateLimiters.session, async () => {
  const user = await getCurrentUser();
  if (!user) return jsonResponse<SessionResponse>({ user: null, accountsEnabled: accountsEnabled() });

  const username = await getUsername(await createSessionClient(), user.id);
  return jsonResponse<SessionResponse>({ user: { username }, accountsEnabled: true });
});
