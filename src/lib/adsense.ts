/**
 * Google AdSense publisher ID, such as "ca-pub-1234567890123456", from
 * NEXT_PUBLIC_ADSENSE_CLIENT. Unset means no AdSense at all.
 *
 * For now this only proves to Google that you own the site, through a meta tag and
 * /ads.txt. Neither loads anything or sets cookies. Ads themselves come after
 * approval, together with Google's certified consent message for EU visitors.
 */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export const ADSENSE_CLIENT = CLIENT && /^ca-pub-\d{10,20}$/.test(CLIENT) ? CLIENT : undefined;

/** The line Google expects in ads.txt. The last value is Google's fixed certification ID. */
export function adsTxt(): string | null {
  if (!ADSENSE_CLIENT) return null;
  return `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;
}
