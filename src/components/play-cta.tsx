import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/link";

/**
 * The Play button at the end of the help pages. It sticks to the bottom of the screen
 * while you scroll, with the page fading out underneath it into a soft dark shade, like
 * the language question on the game screen. At the end of the page it settles in place
 * above the footer.
 */
export function PlayCta({ label, note }: { label: string; note: string }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-10 bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-12 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        aria-hidden="true"
        // Full width and running on below the bar, behind the footer, so the glow fades out instead of stopping in a line.
        className="pointer-events-none absolute -bottom-24 left-1/2 h-[calc(100%+6rem)] w-screen -translate-x-1/2 bg-[radial-gradient(ellipse_60%_70%_at_50%_70%,var(--shade),transparent)]"
      />
      <div className="relative mx-auto flex max-w-xs flex-col items-center gap-1.5 text-center">
        <Button asChild className="h-12 w-full text-base font-semibold">
          <Link href="/play">{label}</Link>
        </Button>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}
