import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, LOCALES, localePath, splitLocale, type Locale } from "@/i18n/config";

const LOGIN_REQUIRED = ["/profile", "/choose-username", "/reset-password"];

/**
 * The language a visitor asked for: their saved choice, or on the home page, their
 * browser's language. Other plain paths stay English without a saved choice, so a
 * shared English link isn't redirected on someone else's browser settings.
 */
function preferredLocale(request: NextRequest, path: string): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  if (path !== "/") return DEFAULT_LOCALE;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = Number(params.find((param) => param.trim().startsWith("q="))?.split("=")[1] ?? 1);
      return { language: tag.split("-")[0].toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .filter(({ language, q }) => q > 0 && (LOCALES as readonly string[]).includes(language))
    .sort((a, b) => b.q - a.q);
  return (accepted[0]?.language as Locale | undefined) ?? DEFAULT_LOCALE;
}

/**
 * Runs before page requests.
 *
 * Languages: pages live under app/[lang]. English is served at plain paths (/play is
 * rewritten to /en/play), /en/play redirects to /play, and other languages keep their
 * prefix (/nl/play).
 *
 * Accounts: keeps the session fresh for logged-in visitors and sends guests away from
 * account pages. This is a convenience: the API routes check the session themselves,
 * and they're what protects the data. Guests have no session cookie, so they pass
 * through without touching Supabase.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { locale: pathLocale, path } = splitLocale(pathname);
  const redirect = (to: string, status = 307) => NextResponse.redirect(new URL(`${to}${search}`, request.url), status);

  if (pathLocale === DEFAULT_LOCALE) return redirect(path, 308);

  let locale: Locale = DEFAULT_LOCALE;
  if (pathLocale) {
    locale = pathLocale;
  } else {
    const preferred = preferredLocale(request, path);
    if (preferred !== DEFAULT_LOCALE) return redirect(localePath(preferred, path));
  }

  /** Lets the request through, rewritten to /en/... for plain English paths. */
  const pass = () =>
    pathLocale
      ? NextResponse.next({ request })
      : NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url), { request });

  const hasSession = request.cookies
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && !name.includes("code-verifier"));

  if (!hasSession) {
    if (!LOGIN_REQUIRED.includes(path)) return pass();
    const login = new URL(localePath(locale, "/login"), request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return pass();

  let response = pass();
  const supabase = createServerClient(url, anonKey, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = pass();
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // Reading the user refreshes an expired token through setAll above. If Supabase
  // is unreachable the page should still load, so failures are ignored here.
  await supabase.auth.getUser().catch(() => undefined);
  return response;
}

export const config = {
  // Everything except API routes, the auth callback, Next's own files, the generated
  // preview images, and files with an extension, such as /logo.png and /sitemap.xml.
  matcher: "/((?!api|auth/callback|_next/static|_next/image|.*opengraph-image|.*\\..*).*)",
};
