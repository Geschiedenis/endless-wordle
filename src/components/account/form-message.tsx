import { CircleAlert, CircleCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/**
 * The result of a form, shown at the top of it, under the heading: where people look
 * after pressing the button, without pushing the button around. Problems with a single
 * field are shown under that field instead.
 */
export function FormMessage({
  error,
  success,
  className,
}: {
  error?: string | null;
  success?: string | null;
  className?: string;
}) {
  // Always mounted, so screen readers announce what appears in it.
  return (
    <div aria-live="polite" className={cn("empty:hidden", className)}>
      {error ? (
        <Alert variant="destructive" role="alert">
          <CircleAlert aria-hidden="true" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : success ? (
        <Alert variant="success" role="status">
          <CircleCheck aria-hidden="true" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
