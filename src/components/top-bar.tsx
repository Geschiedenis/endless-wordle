"use client";

import { AuthMenu } from "@/components/auth-menu";
import { LanguageMenu } from "@/components/language-menu";
import { Logo } from "@/components/logo";
import { PreferenceToggles } from "@/components/preference-toggles";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * The bar at the top of every page: language on the left, the logo in the middle
 * linking home, and the account and display controls on the right. It sets its own
 * width and height, so it sits in exactly the same place on every page. Pages give
 * it a 16px gutter on each side.
 */
export function TopBar({ showLogo = true, className }: { showLogo?: boolean; className?: string }) {
  const { dict } = useI18n();
  return (
    <header className={cn("grid h-12 w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2", className)}>
      <div className="justify-self-start">
        <LanguageMenu />
      </div>
      {showLogo ? (
        <Link href="/" aria-label={dict.header.home} className="rounded-md">
          <Logo size={28} />
        </Link>
      ) : (
        <span />
      )}
      <div className="flex min-w-0 items-center justify-end gap-1">
        <AuthMenu />
        <PreferenceToggles />
      </div>
    </header>
  );
}
