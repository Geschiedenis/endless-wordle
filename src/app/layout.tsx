import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { PREFERENCES_SCRIPT } from "@/lib/preferences";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Endless Wordle",
  description:
    "A Wordle that never stops. Spare guesses roll over to the next word, and the game only ends when you run out.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The script below sets theme attributes on <html> before React hydrates.
    <html lang="en" className={`${geistSans.variable} dark h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Applied before first paint, so a saved dark theme never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
