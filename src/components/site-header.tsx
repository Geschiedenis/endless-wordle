import Link from "next/link";
import { AuthMenu } from "@/components/auth-menu";
import { PreferenceToggles } from "@/components/preference-toggles";

/** The header for every page except the landing page and the game. */
export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between py-2">
      <Link href="/" className="rounded-sm text-base font-bold tracking-tight whitespace-nowrap sm:text-lg">
        Endless Wordle
      </Link>
      <div className="flex items-center gap-1">
        <AuthMenu />
        <PreferenceToggles />
      </div>
    </header>
  );
}
