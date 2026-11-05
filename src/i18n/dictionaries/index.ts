import type { Locale } from "../config";
import { de } from "./de";
import { en, type Dictionary } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nl } from "./nl";

export type { Dictionary, Plural } from "./en";

/** Small enough to import whole. Pages only send their own language to the browser. */
export const DICTIONARIES: Record<Locale, Dictionary> = { en, nl, de, fr, es };
