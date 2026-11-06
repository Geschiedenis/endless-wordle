"use client"

import * as React from "react"
import { Eye, EyeOff, LockKeyhole } from "lucide-react"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { useI18n } from "@/i18n/provider"

/** A password field with a lock icon and a button at the end to show or hide what's typed. */
function PasswordInput(props: Omit<React.ComponentProps<"input">, "type">) {
  const { dict } = useI18n()
  const [visible, setVisible] = React.useState(false)
  const label = visible ? dict.login.hidePassword : dict.login.showPassword
  return (
    <InputWithIcon
      {...props}
      icon={LockKeyhole}
      type={visible ? "text" : "password"}
      end={
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={label}
          aria-pressed={visible}
          title={label}
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
      }
    />
  )
}

export { PasswordInput }
