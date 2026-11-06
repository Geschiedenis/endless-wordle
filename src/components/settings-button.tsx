"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

/** The gear in the top bar, leading to the settings page. */
export function SettingsButton() {
  const { dict } = useI18n();
  return (
    <Button asChild variant="ghost" size="icon" className="size-9">
      <Link href="/settings" aria-label={dict.header.settings} title={dict.header.settings}>
        <Settings aria-hidden="true" />
      </Link>
    </Button>
  );
}
