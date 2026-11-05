import type { SignupResponse } from "@/lib/account-types";
import { errorResponse, guardedRoute, jsonResponse, parseJsonBody, rateLimiters } from "@/lib/server/http";
import { createSessionClient } from "@/lib/server/supabase";
import { signupSchema } from "@/lib/validation";

export const POST = guardedRoute(rateLimiters.signup, async (request) => {
  const body = await parseJsonBody(request, signupSchema);
  if (!body) return errorResponse("invalid_request");

  const supabase = await createSessionClient();
  const { email, password, locale } = body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${new URL(request.url).origin}/auth/callback?next=/choose-username`,
      // Readable in the email templates as {{ .Data.locale }}.
      data: { locale },
    },
  });

  if (error) {
    if (error.code === "weak_password") return errorResponse("weak_password");
    if (error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit") {
      return errorResponse("rate_limited");
    }
    // Same answer as a new address, so sign-up can't reveal who has an account.
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return jsonResponse<SignupResponse>({ status: "confirm_email" });
    }
    throw error;
  }

  return jsonResponse<SignupResponse>({ status: data.session ? "signed_in" : "confirm_email" });
});
