import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Width and height in pixels. */
  size?: number;
  /** Leave empty where the name is already written next to the logo. */
  alt?: string;
  className?: string;
}

/** The logo. public/logo.png is the same image, for emails, which can't show SVGs. */
export function Logo({ size = 112, alt = "", className }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      unoptimized
    />
  );
}
