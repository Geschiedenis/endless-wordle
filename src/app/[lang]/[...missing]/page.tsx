import { notFound } from "next/navigation";

/**
 * Any address under a language that no page matches, such as /nl/bestaat-niet. It shows
 * the language's own 404 page (not-found.tsx), inside the site's layout.
 */
// It only ever shows the 404 page, so there's no navigation to check for instant UI.
export const instant = false;

export default function Missing() {
  notFound();
}
