"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localePath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { canGoBackInApp } from "@/lib/in-app-history";

/**
 * Returns to the previous page of the site, such as a game in progress, which picks up
 * where it was. Opened directly from outside, there's nothing to go back to on the
 * site, so it goes to the home page rather than leaving.
 */
export function BackButton() {
  const router = useRouter();
  const { locale, dict } = useI18n();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="-ml-2 size-10 shrink-0"
      aria-label={dict.header.back}
      title={dict.header.back}
      onClick={() => (canGoBackInApp() ? router.back() : router.push(localePath(locale, "/")))}
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
    </Button>
  );
}
