import { Fragment, type ReactNode, createElement } from "react";
import type { Plural } from "./dictionaries";

type Values = Record<string, string | number>;

/** Fills in placeholders: format("Row {number}", { number: 2 }) is "Row 2". */
export function format(template: string, values: Values = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Picks the singular or plural form, then fills in {count} and any other values. */
export function plural(forms: Plural, count: number, values: Values = {}): string {
  return format(count === 1 ? forms.one : forms.other, { count, ...values });
}

/**
 * Like format, but a placeholder can be any React node, such as a link or bold text.
 * Word order differs between languages, so sentences are never built from pieces.
 */
export function rich(template: string, values: Record<string, ReactNode>): ReactNode {
  const parts = template.split(/\{(\w+)\}/g);
  return parts.map((part, index) =>
    createElement(Fragment, { key: index }, index % 2 === 1 ? (values[part] ?? `{${part}}`) : part),
  );
}

/** The message for a failed API call, in the page's language. */
export function errorMessage(dict: { errors: Record<string, string> }, result: { error: string }): string {
  return dict.errors[result.error] ?? dict.errors.server_error;
}
