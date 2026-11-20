"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { ARCHIVE } from "@/content/archive";
import { HOME } from "@/content/home";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const LINK = "rounded-sm transition-colors hover:text-foreground";

/**
 * Full width, on a slightly lighter shade than the page instead of a divider line. The
 * logo and a short line on the left, then the links in four groups (game, help, about,
 * legal) spread across the rest: two columns on phones, four from the sm breakpoint, and
 * beside the logo from lg. Settings, including cookies, are behind the gear in the top bar.
 */
export function SiteFooter() {
  const { dict, locale } = useI18n();
  const t = dict.footer;
  return (
    // Pages have a 16px gutter: -mx-4 takes the footer to the edges. It sits above the
    // help pages' sticky Play button, so that button's glow ends at the footer.
    <footer className="relative z-20 -mx-4 mt-6 bg-background text-sm text-muted-foreground">
      <div className="bg-muted/40 px-4">
        <div className="mx-auto grid w-full max-w-6xl gap-10 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <Logo height={44} />
            <p className="max-w-64">{t.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            <Group title={t.playTitle}>
              <Link href="/play" className={LINK}>
                {dict.home.play}
              </Link>
              <Link href="/daily" className={LINK}>
                {dict.home.daily}
              </Link>
              <Link href="/daily/archive" className={LINK}>
                {ARCHIVE[locale].link}
              </Link>
            </Group>
            <Group title={t.helpTitle}>
              <Link href="/how-to-play" className={LINK}>
                {dict.home.howToPlay}
              </Link>
              <Link href="/tips" className={LINK}>
                {t.tips}
              </Link>
              <Link href="/faq" className={LINK}>
                {t.faq}
              </Link>
            </Group>
            <Group title={t.moreTitle}>
              <Link href="/about" className={LINK}>
                {t.about}
              </Link>
              <Link href="/contact" className={LINK}>
                {t.contact}
              </Link>
              <a
                href={HOME[locale].miniCross.url}
                target="_blank"
                rel="noopener"
                className={cn(LINK, "inline-flex items-center gap-0.5")}
              >
                Endless Mini Cross
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </Group>
            <Group title={t.legal}>
              <Link href="/privacy" className={LINK}>
                {t.privacy}
              </Link>
              <Link href="/terms" className={LINK}>
                {t.terms}
              </Link>
            </Group>
          </div>
          <p className="text-xs lg:col-span-2">© 2026 Endless Lingle</p>
        </div>
      </div>
    </footer>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title} className="flex flex-col items-start gap-2.5">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      {children}
    </nav>
  );
}
