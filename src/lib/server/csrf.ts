/**
 * True if a state-changing request came from this site's own pages. Browsers
 * attach Origin to every POST, PUT and DELETE and scripts can't forge it, so
 * another site can't get a visitor's browser past this check.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
