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

/** The LINGLE logo: game tiles as raised keys, coloured like a guess on the board. public/logo.png is the same image, for emails, which can't show SVGs. */
export function Logo({ height = 32, eager = false, alt = "", className }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt={alt}
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      className={cn("shrink-0", className)}
      unoptimized
      loading={eager ? "eager" : undefined}
    />
  );
}
