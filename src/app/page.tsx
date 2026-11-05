import Link from "next/link";
import { AuthMenu } from "@/components/auth-menu";
import { Logo } from "@/components/logo";
import { PreferenceToggles } from "@/components/preference-toggles";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col px-4">
      <header className="flex justify-end gap-1 py-3">
        <AuthMenu />
        <PreferenceToggles />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
        <Logo />
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Endless Wordle</h1>
        <p className="mt-3 max-w-sm text-balance text-muted-foreground">
          Wordle, but it never stops. Spare guesses roll over to the next word, and the game only
          ends when you run out.
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Button asChild className="h-12 text-base font-semibold">
            <Link href="/play">Play</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
