import { adsTxt } from "@/lib/adsense";

/**
 * /ads.txt: lists who may sell ads on this site, so others can't pretend to. Only
 * exists once NEXT_PUBLIC_ADSENSE_CLIENT is set.
 */
export function GET() {
  const body = adsTxt();
  if (!body) return new Response("Not found", { status: 404 });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
