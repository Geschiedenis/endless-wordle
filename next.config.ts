import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { NextConfig } from "next";

const REQUIRED_IN_PRODUCTION = [
  "GAME_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

/**
 * Fails the build rather than the site. On Vercel, a failed build leaves the
 * previous deployment serving traffic.
 */
function assertProductionEnv() {
  const missing = REQUIRED_IN_PRODUCTION.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. See "Environment variables" in the README.`,
    );
  }
  if (new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).pathname !== "/") {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be the project URL only, with no path such as /rest/v1/.");
  }
}

/**
 * script-src needs 'unsafe-inline' because these pages are prerendered and Next.js
 * adds inline scripts to them. The stricter nonce approach requires rendering every
 * page per request. No page calls another origin: Supabase is only reached from the
 * server.
 */
function contentSecurityPolicy(isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export default function config(phase: string): NextConfig {
  // `next typegen` loads this file with the same phase, but deploys nothing.
  if (phase === PHASE_PRODUCTION_BUILD && !process.argv.includes("typegen")) assertProductionEnv();

  return {
    cacheComponents: true,
    partialPrefetching: true,
    poweredByHeader: false,
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "Content-Security-Policy", value: contentSecurityPolicy(process.env.NODE_ENV !== "production") },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ],
        },
      ];
    },
  };
}
