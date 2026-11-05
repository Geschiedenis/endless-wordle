#!/usr/bin/env node
/**
 * Regenerates the Dutch, German, French and Spanish lists in data/<lang>/. The
 * generated files are committed, so this only needs to run to change them. See
 * "Word lists" in the README for where to get the inputs.
 *
 * Valid guesses: every five-letter word a Hunspell dictionary can produce from its
 * stems and suffix rules. Answers: the most frequent dictionary stems (base forms,
 * so no plurals or conjugations), ranked by how often they appear in subtitles,
 * minus names, abbreviations and the words in scripts/blocklists/<lang>.txt.
 *
 * Usage: node scripts/build-intl-word-lists.mjs <dir>
 * where <dir> holds dictionary-<lang>/ (unpacked npm packages) and freq-<lang>.txt.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [sourceDir] = process.argv.slice(2);
if (!sourceDir) {
  console.error("Usage: build-intl-word-lists.mjs <dir>");
  process.exit(1);
}

const LENGTH = 5;
const ANSWER_COUNT = 2500;

/**
 * Letters each language plays with. Other accents are dropped (é counts as e), as in
 * most Wordle versions for these languages. Words with other letters are left out.
 */
const LANGUAGES = {
  // The dictionary writes ij as one character, but players type two letters.
  nl: { letters: "abcdefghijklmnopqrstuvwxyz", keep: "", spell: { "ĳ": "ij" } },
  // ß is typed as ss, as on keyboards without it. Such words are guesses, never answers.
  de: { letters: "abcdefghijklmnopqrstuvwxyzäöü", keep: "äöü", spell: { "ß": "ss" } },
  fr: { letters: "abcdefghijklmnopqrstuvwxyz", keep: "", spell: { "œ": "oe", "æ": "ae" } },
  es: { letters: "abcdefghijklmnopqrstuvwxyzñ", keep: "ñ", spell: {} },
};

/**
 * German dictionary flags. A capitalised stem with only these is a name (Putin/S,
 * Athen/Sm), since real nouns also carry a plural flag. A lowercase stem with any of
 * VERB_FORM_FLAGS is a verb stem or inflected form (lösch/hke, abgab/Z), not a good answer.
 */
const GERMAN_NAME_FLAGS = /^[SsMm]*$/;
const GERMAN_VERB_FORM_FLAGS = /[ZVWhP]/;

/** Lowercases and drops accents, except on the letters the language keeps. Null if unusable. */
function normalize(word, { letters, keep, spell = {} }) {
  let result = "";
  let text = word.normalize("NFC").toLowerCase();
  for (const [from, to] of Object.entries(spell)) text = text.replaceAll(from, to);
  for (const char of text) {
    if (keep.includes(char)) {
      result += char;
      continue;
    }
    const base = char.normalize("NFD").replace(/\p{M}/gu, "");
    if (base.length !== 1 || !letters.includes(base)) return null;
    result += base;
  }
  return result;
}

/** Splits a Hunspell flag string according to the dictionary's FLAG setting. */
function splitFlags(flags, mode) {
  if (!flags) return [];
  if (mode === "long") return flags.match(/../g) ?? [];
  if (mode === "num") return flags.split(",");
  return [...flags];
}

/** Reads the suffix rules from an .aff file. Prefixes and compounds aren't needed for five-letter words. */
function readAffixes(affText) {
  const mode = affText.match(/^FLAG\s+(\S+)/m)?.[1] ?? "char";
  const suffixes = new Map();
  for (const line of affText.split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] !== "SFX" || parts.length < 5) continue;
    const [, flag, strip, addWithFlags, condition] = parts;
    const [add, continuation] = addWithFlags.split("/");
    const rule = {
      strip: strip === "0" ? "" : strip,
      add: add === "0" ? "" : add,
      condition: condition === "." ? null : new RegExp(`${condition}$`, "u"),
      continuation: splitFlags(continuation, mode),
    };
    if (!suffixes.has(flag)) suffixes.set(flag, []);
    suffixes.get(flag).push(rule);
  }
  return { mode, suffixes };
}

/** A stem and every form its suffix flags produce, one continuation level deep. */
function expand(stem, flags, { suffixes }) {
  const forms = [stem];
  const apply = (word, flagList, depth) => {
    for (const flag of flagList) {
      for (const rule of suffixes.get(flag) ?? []) {
        if (rule.condition && !rule.condition.test(word)) continue;
        if (rule.strip && !word.endsWith(rule.strip)) continue;
        const form = word.slice(0, word.length - rule.strip.length) + rule.add;
        forms.push(form);
        if (depth < 1 && rule.continuation.length) apply(form, rule.continuation, depth + 1);
      }
    }
  };
  apply(stem, flags, 0);
  return forms;
}

function readList(file) {
  try {
    return readFileSync(file, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
}

for (const [lang, alphabet] of Object.entries(LANGUAGES)) {
  const dictDir = path.join(sourceDir, `dictionary-${lang}`);
  const affixes = readAffixes(readFileSync(path.join(dictDir, "index.aff"), "utf8"));
  const dicLines = readFileSync(path.join(dictDir, "index.dic"), "utf8").split("\n").slice(1);

  const guesses = new Set();
  /** Base forms that may become answers. */
  const stems = new Set();

  for (const line of dicLines) {
    const entry = line.split(/\s/)[0];
    if (!entry) continue;
    const slash = entry.search(/(?<!\\)\//);
    const stem = slash === -1 ? entry : entry.slice(0, slash);
    const flags = slash === -1 ? [] : splitFlags(entry.slice(slash + 1), affixes.mode);

    // Abbreviations (two or more capitals) never count. Capitalised words are names,
    // except in German, where every noun is capitalised.
    if ((stem.match(/\p{Lu}/gu) ?? []).length > 1) continue;
    if (lang !== "de" && /^\p{Lu}/u.test(stem)) continue;

    for (const form of expand(stem, flags, affixes)) {
      const word = normalize(form, alphabet);
      if (word?.length === LENGTH) guesses.add(word);
    }
    const base = normalize(stem, alphabet);
    if (base?.length !== LENGTH || stem.includes("ß")) continue;
    if (lang === "de") {
      const flagText = flags.join("");
      const isNoun = /^\p{Lu}/u.test(stem);
      if (isNoun ? GERMAN_NAME_FLAGS.test(flagText) : GERMAN_VERB_FORM_FLAGS.test(flagText)) continue;
    }
    stems.add(base);
  }

  const blocklist = new Set(readList(new URL(`./blocklists/${lang}.txt`, import.meta.url)).map((w) => normalize(w, alphabet)));
  const ranked = readList(path.join(sourceDir, `freq-${lang}.txt`))
    .map((line) => normalize(line.split(" ")[0], alphabet))
    .filter((word) => word?.length === LENGTH);

  const answers = [];
  const seen = new Set();
  for (const word of ranked) {
    if (answers.length === ANSWER_COUNT) break;
    if (seen.has(word) || !stems.has(word) || blocklist.has(word)) continue;
    seen.add(word);
    answers.push(word);
  }
  for (const word of answers) guesses.add(word);

  const outDir = new URL(`../data/${lang}/`, import.meta.url);
  mkdirSync(outDir, { recursive: true });
  const write = (name, words) =>
    writeFileSync(new URL(name, outDir), `[\n${[...words].sort().map((w) => JSON.stringify(w)).join(",\n")}\n]\n`);
  write("answers.json", answers);
  write("valid-guesses.json", guesses);
  console.log(`${lang}: ${answers.length} answers, ${guesses.size} valid guesses`);
}
