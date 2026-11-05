import Link from "next/link";

/** Includes the short cookie and data notice. */
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-2xl py-4 text-center text-xs text-muted-foreground">
      <p>
        We only use cookies needed to run the game and keep you logged in. Accounts store your
        email, username and scores.
      </p>
      <nav aria-label="Legal" className="mt-1 flex justify-center gap-3">
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy
        </Link>
        <Link href="/terms" className="underline underline-offset-2">
          Terms
        </Link>
      </nav>
    </footer>
  );
}
