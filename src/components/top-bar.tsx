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
  /** Where the logo goes: before the language menu, or in the middle of the bar (the home page). */
  logo?: "start" | "center";
  className?: string;
}) {
  const { dict } = useI18n();
  const home = (size: number) => (
    <Link href="/" aria-label={dict.header.home} className="rounded-md">
      <Logo size={size} />
    </Link>
  );
  return (
    <header className={cn("relative flex h-12 w-full shrink-0 items-center justify-between gap-2", className)}>
      <div className="flex items-center gap-1.5">
        {logo === "start" && home(28)}
        <LanguageMenu />
      </div>
      {/* Sits a little lower than the bar's middle, so the bigger logo has room above it. */}
      {logo === "center" && <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/4">{home(48)}</div>}
      <div className="flex min-w-0 items-center justify-end gap-1">
        <AuthMenu />
        <SettingsButton />
      </div>
    </header>
  );
}
