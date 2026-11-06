"use client";

import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { Logo } from "@/components/logo";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

/**
 * One row from the sm breakpoint: copyright at the left edge of the screen, links centred.
 * The empty third column balances the first, which keeps the links truly centred.
 * Narrower screens stack the two, as the row wouldn't fit.
 */
export function SiteFooter() {
  const { dict } = useI18n();
  return (
    <footer className="flex w-full flex-col items-center gap-2 py-4 text-xs text-muted-foreground sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
      <p className="flex items-center gap-1.5 sm:order-first sm:justify-self-start">
        <Logo size={16} className="rounded-[3px]" />
        Endless Lingle © 2026
      </p>
      <nav className="order-first flex flex-wrap justify-center gap-x-3 gap-y-1 sm:order-none">
        <Link href="/faq" className="underline underline-offset-2">
          {dict.footer.faq}
        </Link>
        <Link href="/tips" className="underline underline-offset-2">
          {dict.footer.tips}
        </Link>
        <Link href="/privacy" className="underline underline-offset-2">
          {dict.footer.privacy}
        </Link>
        <Link href="/terms" className="underline underline-offset-2">
          {dict.footer.terms}
        </Link>
        <CookieSettingsButton />
      </nav>
    </footer>
  );
}
