"use client";

import { AuthMenu } from "@/components/auth-menu";
import { LanguageMenu } from "@/components/language-menu";
import { Logo } from "@/components/logo";
import { SettingsButton } from "@/components/settings-button";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * The bar at the top of every page: the language menu on the left, the logo linking
 * home in the middle, and the account menu and settings on the right. It sets its own
 * width and height, so it sits in exactly the same place on every page. Pages give
 * it a 16px gutter on each side.
 */
export function TopBar({
  logo = true,
  className,
}: {
  /** False on the home page, which shows the logo above its title instead. */
  logo?: boolean;
  className?: string;
}) {
  const { dict } = useI18n();
  const home = (className: string, height: number) => (
    <Link href="/" aria-label={dict.header.home} className={cn("rounded-md", className)}>
      <Logo height={height} />
    </Link>
  );
  return (
    // A three-column grid keeps the logo in the middle. If a long login button or
    // username needs the room, it moves aside instead of being covered.
    <header className={cn("relative grid h-12 w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2", className)}>
      <div className="justify-self-start">
        <LanguageMenu />
      </div>
      {logo && (
        <div>
          {home("block md:hidden", 24)}
          {home("hidden md:block", 28)}
        </div>
      )}
      <div className="col-start-3 flex items-center justify-end gap-1 justify-self-end">
        <AuthMenu />
        <SettingsButton />
      </div>
    </header>
  );
}
