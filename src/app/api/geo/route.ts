import type { GeoResponse } from "@/i18n/suggest";
import { guardedRoute, jsonResponse, rateLimiters } from "@/lib/server/http";

/**
 * The visitor's country, for suggesting a language. Vercel works it out from the IP
 * address and sets this header itself, overwriting anything the browser sends.
 * Nothing is stored.
 */
export const GET = guardedRoute(rateLimiters.geo, async (request) => {
  const country = request.headers.get("x-vercel-ip-country");
  return jsonResponse<GeoResponse>({ country: country && /^[A-Z]{2}$/.test(country) ? country : null });
});
