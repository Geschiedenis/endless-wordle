import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A titled section with a border, the building block of the profile and settings pages. */
export function SectionCard({
  title,
  description,
  tone = "default",
  children,
}: {
  title?: string;
  description?: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cn("rounded-xl border p-5", tone === "danger" ? "border-destructive/40 bg-destructive/5" : "bg-muted/30")}
    >
      {title && (
        <h2 id={id} className={cn("text-lg font-semibold", tone === "danger" && "text-destructive")}>
          {title}
        </h2>
      )}
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className={cn(title && "mt-4")}>{children}</div>
    </section>
  );
}
