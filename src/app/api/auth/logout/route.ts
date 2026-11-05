import { guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";
import { createSessionClient } from "@/lib/server/supabase";

export const POST = guardedRoute(rateLimiters.logout, async () => {
  const supabase = await createSessionClient();
  // Only this device. An error still clears the local cookies, which is what matters here.
  await supabase.auth.signOut({ scope: "local" });
  return jsonResponse({ ok: true });
});
