"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { StorageList } from "@/components/storage-list";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  closeCookieSettings,
  getConsent,
  isCookieSettingsRequested,
  saveConsent,
  subscribeToConsent,
} from "@/lib/consent";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

const onServer = () => false;

/**
 * Asks once per browser, and again from the "Cookie settings" link. Reject and accept
 * are equally easy, and nothing optional runs until the visitor accepts.
 */
export function CookieNotice() {
  const { dict } = useI18n();
  const t = dict.cookies;
  const settingsRequested = useSyncExternalStore(subscribeToConsent, isCookieSettingsRequested, onServer);
  const [needsChoice, setNeedsChoice] = useState(false);

  // Waits until the page has loaded and the browser is idle. Opening a modal hides the
  // rest of the page from screen readers, which breaks hydration if the page isn't done.
  useEffect(() => {
    if (getConsent()) return;
    // Older Safari versions don't have requestIdleCallback.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let handle = 0;
    const show = () => {
      handle = hasIdle
        ? window.requestIdleCallback(() => setNeedsChoice(true))
        : window.setTimeout(() => setNeedsChoice(true), 200);
    };
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => {
      window.removeEventListener("load", show);
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  function choose(accept: boolean) {
    saveConsent({ analytics: accept, advertising: accept });
    setNeedsChoice(false);
  }

  // Until a choice is made, the dialog can only be closed with one of the two buttons.
  const mustChoose = needsChoice && !settingsRequested;
  const keepOpen = (event: Event) => {
    if (mustChoose) event.preventDefault();
  };

  return (
    <Dialog open={needsChoice || settingsRequested} onOpenChange={(open) => !open && closeCookieSettings()}>
      <DialogContent onEscapeKeyDown={keepOpen} onInteractOutside={keepOpen} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <Collapsible className="rounded-md border">
          <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium">
            {t.details}
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t px-3 py-3">
            <StorageList dict={dict} />
          </CollapsibleContent>
        </Collapsible>

        {/* Sticks to the bottom while the details scroll, so the choice is always in reach. */}
        <DialogFooter className="sticky -bottom-5 -mx-5 -mb-5 flex-col border-t bg-popover px-5 pt-4 pb-5 sm:flex-col sm:items-stretch">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => choose(false)} className="h-11 text-base font-semibold">
              {t.reject}
            </Button>
            <Button onClick={() => choose(true)} className="h-11 text-base font-semibold">
              {t.accept}
            </Button>
          </div>
          <Link
            href="/privacy"
            onClick={closeCookieSettings}
            className="self-center text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {t.privacyNotice}
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
