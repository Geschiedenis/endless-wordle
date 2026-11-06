import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"

/**
 * An input with an icon at the start, saying what goes in it, and an optional
 * control at the end, such as a show-password button. The icon is decorative:
 * the field's label does the explaining.
 */
function InputWithIcon({
  icon: Icon,
  end,
  className,
  ...props
}: React.ComponentProps<"input"> & { icon: LucideIcon; end?: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input className={cn("pl-9", end && "pr-11", className)} {...props} />
      {end && <div className="absolute inset-y-0 right-0 flex items-center pr-1">{end}</div>}
    </div>
  )
}

export { InputWithIcon }
