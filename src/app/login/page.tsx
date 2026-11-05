import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Login | Endless Wordle",
};

/** V2: replace with the real sign-in flow. */
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Coming soon</h1>
      <p className="mt-3 max-w-sm text-balance text-muted-foreground">
        Accounts and highscores are on the way. For now, you can play without logging in.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <Button asChild className="h-12 text-base font-semibold">
          <Link href="/play">Play</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 text-base">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
