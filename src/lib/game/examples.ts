import type { Locale } from "@/i18n/config";

/**
 * Example words per language, all from that language's word lists. The first guess
 * scores one green, one yellow and three grey tiles; the second is one letter off.
 * The colours are worked out by the game's own scoring, so they can't drift.
 */
export const HOW_TO_PLAY_EXAMPLES: Record<Locale, { first: string; second: string; answer: string; lost: string }> = {
  en: { first: "crane", second: "store", answer: "shore", lost: "plant" },
  nl: { first: "brand", second: "laars", answer: "kaars", lost: "fiets" },
  de: { first: "baron", second: "macht", answer: "nacht", lost: "sonne" },
  fr: { first: "ambre", second: "forte", answer: "porte", lost: "plage" },
  es: { first: "besar", second: "cerro", answer: "perro", lost: "playa" },
};

/**
 * Example words for the tips page, per language, all from that language's lists. A
 * test checks each one shows what its tip describes, scored by the game's own rules.
 *
 * - weak: a first guess that finds just one yellow letter
 * - explore: five new letters, lighting up several tiles
 * - mover: places one of explore's yellow letters where it turns green
 * - ending: a word with the language's common ending (-ER, -EN, -AR)
 * - double: a word that uses a letter twice
 */
export const TIP_EXAMPLES: Record<
  Locale,
  { answer: string; weak: string; explore: string; mover: string; ending: string; double: string }
> = {
  en: { answer: "acute", weak: "badly", explore: "chute", mover: "actor", ending: "later", double: "speed" },
  nl: { answer: "amber", weak: "bijou", explore: "adres", mover: "alter", ending: "bomen", double: "zeker" },
  de: { answer: "april", weak: "baden", explore: "lyrik", mover: "ampel", ending: "augen", double: "messe" },
  fr: { answer: "acide", weak: "bahut", explore: "corde", mover: "acier", ending: "aimer", double: "terre" },
  es: { answer: "amigo", weak: "bache", explore: "grifo", mover: "apego", ending: "estar", double: "perro" },
};
