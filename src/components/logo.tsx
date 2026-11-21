import Image from "next/image";
import { cn } from "@/lib/utils";

/** Width / height of public/logo.svg: six raised game tiles, each a little turned and nudged. */
export const LOGO_RATIO = 655 / 162;

interface LogoProps {
  /** Height in pixels. The width follows from the logo's ratio. */
  height?: number;
  /** Load it straight away, where it's the biggest thing on the first screen (the home page). */
  eager?: boolean;
  /** Leave empty where the name is already written next to the logo. */
  alt?: string;
  className?: string;
}

/**
 * The LINGLE logo: game tiles as raised keys, coloured like a guess on the board.
 * public/logo-light.svg has a lighter grey and a paler shadow for light mode; CSS shows
 * the one that fits the theme. public/logo.png is the dark one, for emails, which can't
 * show SVGs.
 */
export function Logo({ height = 32, eager = false, alt = "", className }: LogoProps) {
  const props = {
    width: Math.round(height * LOGO_RATIO),
    height,
    unoptimized: true,
    loading: eager ? ("eager" as const) : undefined,
  };
  return (
    <>
      <Image src="/logo-light.svg" alt={alt} {...props} className={cn("shrink-0 dark:hidden", className)} />
      <Image src="/logo.svg" alt={alt} {...props} className={cn("hidden shrink-0 dark:block", className)} />
    </>
  );
}
