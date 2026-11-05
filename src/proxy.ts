import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_REQUIRED = ["/profile", "/choose-username", "/reset-password"];

/**
 * Runs before page requests. Keeps the session fresh for logged-in visitors and
 * sends guests away from account pages. This is a convenience: the API routes
 * check the session themselves, and they're what protects the data. Guests have
 * no session cookie, so they pass through without touching Supabase.
 */
export async function proxy(request: NextRequest) {
  const hasSession = request.cookies
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && !name.includes("code-verifier"));
  const { pathname } = request.nextUrl;

  if (!hasSession) {
    if (!LOGIN_REQUIRED.includes(pathname)) return NextResponse.next();
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next();

  let response = NextResponse.next({ request });
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
        response = NextResponse.next({ request });
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
  matcher: "/((?!api|auth/callback|_next/static|_next/image|icon.svg).*)",
};
