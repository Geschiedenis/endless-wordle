"use client";

import { Logo } from "@/components/logo";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

const LINK = "underline underline-offset-2";

/**
 * One row from the sm breakpoint: copyright on the left, legal links in the middle,
 * help on the right. Settings, including cookies, are behind the gear in the top bar. The outer columns share the leftover space equally,
 * which keeps the middle truly centred. Narrower screens stack them.
 */
export function SiteFooter() {
  const { dict } = useI18n();
  return (
    <footer className="flex w-full flex-col items-center gap-2 py-4 text-xs text-muted-foreground sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
      <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 sm:col-start-3 sm:row-start-1 sm:justify-self-end">
        <Link href="/how-to-play" className={LINK}>
          {dict.home.howToPlay}
        </Link>
        <Link href="/faq" className={LINK}>
          {dict.footer.faq}
        </Link>
        <Link href="/tips" className={LINK}>
          {dict.footer.tips}
        </Link>
      </nav>
      <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 sm:col-start-2 sm:row-start-1">
        <Link href="/privacy" className={LINK}>
          {dict.footer.privacy}
        </Link>
        <Link href="/terms" className={LINK}>
          {dict.footer.terms}
        </Link>
      </nav>
      <p className="flex items-center gap-1.5 sm:col-start-1 sm:row-start-1 sm:justify-self-start">
        <Logo size={16} className="rounded-[3px]" />
        Endless Lingle © 2026
      </p>
    </footer>
  );
}
