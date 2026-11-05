import { z } from "zod";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { safeNextPath } from "@/lib/navigation";
import { createSessionClient } from "@/lib/server/supabase";

const bodySchema = z.strictObject({ next: z.string().max(64).optional() });

/** Returns Google's sign-in URL for the page to navigate to. */
export const POST = guardedRoute(rateLimiters.oauth, async (request) => {
  const body = await parseJsonBody(request, bodySchema);
  if (!body) return errorResponse("invalid_request");

  const callback = new URL("/auth/callback", request.url);
  callback.searchParams.set("next", safeNextPath(body.next));

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.toString(), skipBrowserRedirect: true },
  });
  if (error) throw error;
  return jsonResponse({ url: data.url });
});
