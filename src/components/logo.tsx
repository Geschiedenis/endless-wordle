import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Shows /public/logo.svg as soon as that file exists. Until then, a clearly
 * marked placeholder holds the same space, so nothing else needs to change.
 */
export function Logo() {
  const hasLogo = existsSync(path.join(process.cwd(), "public", "logo.svg"));

  if (hasLogo) {
    return (
      <Image
        src="/logo.svg"
        alt="Endless Wordle logo"
        width={112}
        height={112}
        className="size-28 object-contain"
        unoptimized
        priority
      />
    );
  }

  return (
    <div
      data-slot="logo-placeholder"
      aria-hidden="true"
      className="flex size-28 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/50 text-xs font-medium tracking-wide text-muted-foreground uppercase"
    >
      Logo
    </div>
  );
}
