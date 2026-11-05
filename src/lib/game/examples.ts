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
