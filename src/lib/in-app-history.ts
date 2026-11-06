/**
 * Counts page changes within the site during this visit, so a back button knows
 * whether going back stays on the site. Browser only, reset on a full page load.
 * Repeated reports of the same page count once, which also covers React running
 * effects twice in development.
 */
let pagesVisited = 0;
let currentPath: string | null = null;

export function recordPageVisit(pathname: string) {
  if (pathname === currentPath) return;
  currentPath = pathname;
  pagesVisited += 1;
}

/** True once the visitor has moved between at least two pages of the site. */
export function canGoBackInApp(): boolean {
  return pagesVisited > 1;
}
