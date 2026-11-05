import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";

/**
 * Lets search engines in everywhere except the API and the email link callback.
 * Account pages aren't blocked here: they carry a noindex tag instead, which
 * search engines can only read if they're allowed to fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
