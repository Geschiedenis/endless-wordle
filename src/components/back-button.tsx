"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

/** Goes to the home page. A plain link, so it can also be opened in a new tab. */
export function BackButton() {
  const { dict } = useI18n();
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="-ml-2 size-10 shrink-0"
    >
      <Link href="/" aria-label={dict.header.back} title={dict.header.back}>
        <ArrowLeft aria-hidden="true" className="size-5" />
      </Link>
    </Button>
  );
}
