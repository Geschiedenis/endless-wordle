import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Small flag images, as files rather than emoji: Windows shows flag emoji as two
 * letters ("US"), not as a flag. The SVGs in public/flags come from flag-icons
 * (MIT licence, https://github.com/lipis/flag-icons), in their 4:3 shape.
 * Decorative, so the language name must be nearby.
 */
export function Flag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    // A tiny static SVG: next/image would add nothing here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${locale}.svg`}
      alt=""
      aria-hidden="true"
      width={20}
      height={15}
      decoding="async"
      className={cn("h-[15px] w-5 shrink-0 rounded-[3px] object-cover ring-1 ring-black/15", className)}
    />
  );
}
