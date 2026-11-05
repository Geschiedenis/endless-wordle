import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Small flag images, drawn here rather than as emoji: Windows shows flag emoji as
 * two letters ("US"), not as a flag. Decorative, so the language name must be nearby.
 */
export function Flag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden="true"
      className={cn("h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/15", className)}
    >
      {FLAGS[locale]}
    </svg>
  );
}

const horizontal = (colours: string[]) =>
  colours.map((colour, i) => (
    <rect key={i} y={(20 / colours.length) * i} width="30" height={20 / colours.length} fill={colour} />
  ));

const FLAGS: Record<Locale, React.ReactNode> = {
  en: (
    <>
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} y={(20 / 13) * i} width="30" height={20 / 13} fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"} />
      ))}
      <rect width="12" height={(20 / 13) * 7} fill="#3C3B6E" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={1.6 + (i % 4) * 2.9} cy={1.5 + Math.floor(i / 4) * 3.4} r="0.55" fill="#FFFFFF" />
      ))}
    </>
  ),
  nl: horizontal(["#AE1C28", "#FFFFFF", "#21468B"]),
  de: horizontal(["#000000", "#DD0000", "#FFCE00"]),
  fr: (
    <>
      <rect width="10" height="20" fill="#0055A4" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#EF4135" />
    </>
  ),
  es: (
    <>
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </>
  ),
};
