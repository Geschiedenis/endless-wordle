import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOME } from "@/content/home";
import type { Locale } from "@/i18n/config";
import { HOVER_ZOOM } from "@/lib/hover-zoom";
import { cn } from "@/lib/utils";

/**
 * The picture on the Endless Mini Cross card: an empty mini crossword the way that
 * game shows one, with the first word across highlighted. "#" is a black square, and
 * the numbers are the clue numbers.
 */
const MINI_CROSS_GRID = [
  ["1", "2", "3", "4", ""],
  ["5", "", "", "", "#"],
  ["6", "", "", "", "7"],
  ["#", "8", "", "", ""],
  ["9", "", "", "", ""],
];

/** Promotes our other game, Endless Mini Cross. */
/**
 * The card for our other game, Endless Mini Cross: a small crossword board beside the
 * text and a button that opens it in a new tab. On the home page and the About page.
 */
export function MiniCrossCard({ locale }: { locale: Locale }) {
  const { title, body, cta, url, imageLabel } = HOME[locale].miniCross;
  return (
    <section aria-labelledby="minicross" className="w-full">
      <div className={cn("flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm md:flex-row", HOVER_ZOOM)}>
        <div className="flex items-center justify-center bg-muted/50 p-8 md:w-2/5">
          <div role="img" aria-label={imageLabel} className="grid grid-cols-5 gap-1 rounded-xl bg-[#2b2b2f] p-1.5">
            {MINI_CROSS_GRID.map((cells, row) =>
              cells.map((cell, column) => (
                <span
                  key={`${row}-${column}`}
                  className={cn(
                    "relative size-11 rounded-md md:size-10",
                    cell === "#"
                      ? "bg-[#0c0c0c]"
                      : row === 0
                        ? // The selected word.
                          "bg-[#d4d4d8] shadow-[0_2px_0_#a1a1aa]"
                        : "bg-white shadow-[0_2px_0_#a1a1aa]",
                  )}
                >
                  {cell !== "#" && cell && (
                    <span className="absolute top-1 left-1.5 text-[11px] leading-none font-bold text-[#18181b]">
                      {cell}
                    </span>
                  )}
                </span>
              )),
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-3 p-6 sm:p-8">
          <h2 id="minicross" className="text-2xl font-bold tracking-tight text-balance">
            {title}
          </h2>
          <p className="text-muted-foreground">{body}</p>
          <Button asChild className="mt-2 h-11 px-5 text-base font-semibold">
            <a href={url} target="_blank" rel="noopener">
              {cta}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
