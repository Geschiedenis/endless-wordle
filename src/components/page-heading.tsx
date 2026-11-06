import type { ReactNode } from "react";
import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";

/**
 * A page's main heading with the back button before it, as on Settings and Profile.
 * Centered headings keep the button on the left without shifting the title.
 */
export function PageHeading({
  children,
  align = "start",
  className,
}: {
  children: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  if (align === "center") {
    return (
      <div className={cn("relative flex items-center justify-center px-10", className)}>
        <div className="absolute top-1/2 left-0 -translate-y-1/2">
          <BackButton />
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight">{children}</h1>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BackButton />
      <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
    </div>
  );
}
