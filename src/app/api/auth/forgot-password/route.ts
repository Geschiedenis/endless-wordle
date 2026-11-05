import { errorResponse, guardedRoute, jsonResponse, logServerError, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { createSessionClient } from "@/lib/server/supabase";
import { emailSchema } from "@/lib/validation";

/** Always answers the same way, so it can't reveal who has an account. */
export const POST = guardedRoute(rateLimiters.passwordReset, async (request) => {
  const body = await parseJsonBody(request, emailSchema);
  if (!body) return errorResponse("invalid_request");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
    redirectTo: `${new URL(request.url).origin}/auth/callback?next=/reset-password`,
  });
  if (error) logServerError("Password reset failed", error);

  return jsonResponse({ ok: true });
});
