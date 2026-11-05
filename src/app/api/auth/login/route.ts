import type { LoginResponse } from "@/lib/account-types";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { getUsername } from "@/lib/server/profiles";
import { createSessionClient } from "@/lib/server/supabase";
import { loginSchema } from "@/lib/validation";

export const POST = guardedRoute(rateLimiters.login, async (request) => {
  const credentials = await parseJsonBody(request, loginSchema);
  if (!credentials) return errorResponse("invalid_credentials");

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    if (error.code === "email_not_confirmed") return errorResponse("email_not_confirmed");
    if (error.code === "over_request_rate_limit") return errorResponse("rate_limited");
    if (error.status && error.status < 500) return errorResponse("invalid_credentials");
    throw error;
  }

  const username = await getUsername(supabase, data.user.id);
  return jsonResponse<LoginResponse>({ needsUsername: username === null });
});
