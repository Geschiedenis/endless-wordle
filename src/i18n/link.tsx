"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localePath } from "./config";
import { useI18n } from "./provider";

/** A next/link that keeps the visitor in their language: "/play" becomes "/nl/play" in Dutch. */
export function Link({ href, ...props }: ComponentProps<typeof NextLink> & { href: string }) {
  const { locale } = useI18n();
  return <NextLink href={href.startsWith("/") ? localePath(locale, href) : href} {...props} />;
}
