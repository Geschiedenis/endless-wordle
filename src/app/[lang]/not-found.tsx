import { Home, Play } from "lucide-react";
import { DemoBoard } from "@/components/demo-board";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/link";
import { getDictionary } from "@/i18n/server";

/**
 * The 404 page, in the site's style and the visitor's language: a board row reading
 * 404, a short note and the way back into the game. Next.js marks it noindex.
 */
export default async function NotFound() {
  const dict = await getDictionary();
  const t = dict.notFound;
  return (
    <PageShell>
      <div className="flex flex-col items-center py-12 text-center sm:py-20">
        <div aria-hidden="true" className="demo-board">
          <DemoBoard rows={[{ word: " 404 ", states: ["empty", "absent", "present", "absent", "empty"] }]} />
        </div>
        <h1 className="mt-10 text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-3 max-w-md text-balance text-muted-foreground">{t.body}</p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Button asChild className="h-12 text-base font-semibold">
            <Link href="/play">
              <Play aria-hidden="true" className="fill-current" />
              {t.play}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 text-base">
            <Link href="/">
              <Home aria-hidden="true" />
              {t.home}
            </Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
