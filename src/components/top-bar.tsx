"use client";

import { AuthMenu } from "@/components/auth-menu";
import { LanguageMenu } from "@/components/language-menu";
import { Logo } from "@/components/logo";
import { SettingsButton } from "@/components/settings-button";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * The bar at the top of every page: the logo linking home and the language menu on
 * the left, the account menu and settings on the right. It sets its own
 * width and height, so it sits in exactly the same place on every page. Pages give
 * it a 16px gutter on each side.
 */
export function TopBar({
  logo = "start",
  className,
}: {
  /** "none" on the home page, which shows the logo above its title instead. */
  logo?: "start" | "none";
  className?: string;
}) {
  const { dict } = useI18n();
  const home = (
    <Link href="/" aria-label={dict.header.home} className="rounded-md">
      <Logo height={22} />
    </Link>
  );
  return (
    <header className={cn("relative flex h-12 w-full shrink-0 items-center justify-between gap-2", className)}>
      <div className="flex items-center gap-1.5">
        {logo === "start" && home}
        <LanguageMenu />
      </div>
      <div className="flex min-w-0 items-center justify-end gap-1">
        <AuthMenu />
        <SettingsButton />
      </div>
    </header>
  );
}
