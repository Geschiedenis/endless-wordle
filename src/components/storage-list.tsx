import type { Dictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import { COOKIE_CATEGORIES, STORAGE_ITEMS } from "@/lib/cookies";
import { cn } from "@/lib/utils";

/**
 * The cookies and local storage the site uses, grouped by category. Fits narrow
 * screens. Takes the dictionary, so the English-only privacy page can show English.
 */
export function StorageList({ dict, className }: { dict: Dictionary; className?: string }) {
  const t = dict.cookies;
  return (
    <div className={cn("flex flex-col gap-4 text-sm", className)}>
      {COOKIE_CATEGORIES.map((category) => {
        const items = STORAGE_ITEMS.filter((item) => item.category === category);
        const { title, description } = t.categories[category];
        return (
          <section key={category} aria-label={title} className="flex flex-col gap-1.5">
            <p className="flex items-baseline justify-between gap-2">
              <strong className="font-semibold">{title}</strong>
              <span className="text-xs text-muted-foreground">
                {category === "necessary" ? t.alwaysOn : items.length === 0 ? t.notUsedYet : t.withConsent}
              </span>
            </p>
            <p className="text-muted-foreground">{description}</p>
            {items.length > 0 && (
              <ul className="mt-1 flex list-none! flex-col gap-0! divide-y rounded-md border pl-0!">
                {items.map((item) => (
                  <li key={item.key} className="flex flex-col gap-0.5 px-3 py-2">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <code className="font-mono text-xs font-semibold break-all">{item.name}</code>
                      <span className="text-xs text-muted-foreground">
                        {item.kind === "cookie" ? t.cookie : t.localStorage}
                      </span>
                    </span>
                    <span>{t.items[item.key].purpose}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(t.kept, { duration: t.items[item.key].duration })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
