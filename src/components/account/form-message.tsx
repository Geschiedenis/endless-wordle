import { cn } from "@/lib/utils";

/** An error or confirmation under a form, announced to screen readers. */
export function FormMessage({ error, success }: { error?: string | null; success?: string | null }) {
  // Always mounted: screen readers only announce changes to an existing live region.
  return (
    <div aria-live="polite" className={cn("text-sm", error ? "text-destructive" : "text-foreground")}>
      {error || success}
    </div>
  );
}
