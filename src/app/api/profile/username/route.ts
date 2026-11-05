import { getCurrentUser } from "@/lib/server/auth";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { saveUsername } from "@/lib/server/profiles";
import { usernameSchema } from "@/lib/validation";

/** Sets the username for the first time, or changes it. */
export const PUT = guardedRoute(rateLimiters.username, async (request) => {
  const user = await getCurrentUser();
  if (!user) return errorResponse("unauthorized");

  const body = await parseJsonBody(request, usernameSchema);
  if (!body) return errorResponse("username_unavailable");

  if (!(await saveUsername(user.id, body.username))) return errorResponse("username_unavailable");
  return jsonResponse({ username: body.username });
});
