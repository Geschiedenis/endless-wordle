import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import { createSessionClient } from "@/lib/server/supabase";
import { updatePasswordSchema } from "@/lib/validation";

/** Sets a new password for the signed-in user, who got here through the reset email. */
export const POST = guardedRoute(rateLimiters.passwordUpdate, async (request) => {
  if (!(await getCurrentUser())) return errorResponse("unauthorized");

  const body = await parseJsonBody(request, updatePasswordSchema);
  if (!body) return errorResponse("invalid_request");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser(body);
  if (error) {
    if (error.code === "weak_password" || error.code === "same_password") return errorResponse("weak_password");
    throw error;
  }
  return jsonResponse({ ok: true });
});
