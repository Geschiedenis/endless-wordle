import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { LOCALES, SITE_URL } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { PREFERENCES_SCRIPT } from "@/lib/preferences";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Every page is built once per language. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    metadataBase: new URL(SITE_URL),
    title: "Endless Wordle",
    description: dict.meta.description,
    applicationName: "Endless Wordle",
  };
}

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    // The script below sets theme attributes on <html> before React hydrates.
    <html lang={locale} className={`${geistSans.variable} dark h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Applied before first paint, so a saved dark theme never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
