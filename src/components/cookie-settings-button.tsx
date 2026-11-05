"use client";

import { useI18n } from "@/i18n/provider";
import { openCookieSettings } from "@/lib/consent";
import { cn } from "@/lib/utils";

/** Pass a label to use other text, such as on the English-only privacy page. */
export function CookieSettingsButton({ className, label }: { className?: string; label?: string }) {
  const { dict } = useI18n();
  return (
    <button type="button" onClick={openCookieSettings} className={cn("rounded-sm underline underline-offset-2", className)}>
      {label ?? dict.footer.cookieSettings}
    </button>
  );
}
