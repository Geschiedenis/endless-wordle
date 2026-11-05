#!/usr/bin/env node
/**
 * Regenerates the English lists, data/en/answers.json and data/en/valid-guesses.json. The generated
 * files are committed, so this only needs to run if you want to change the
 * lists. See "Word lists" in the README for where to get the two inputs.
 *
 * Usage: node scripts/build-word-lists.mjs <scowl-json-dir> <enable1.txt>
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [scowlDir, enablePath] = process.argv.slice(2);
if (!scowlDir || !enablePath) {
  console.error("Usage: build-word-lists.mjs <scowl-json-dir> <enable1.txt>");
  process.exit(1);
}

/** SCOWL levels: up to 35 is "common words", up to 50 is a general dictionary. */
const ANSWER_LEVELS = [10, 20, 35];
const GUESS_LEVELS = [10, 20, 35, 40, 50];
const VARIANTS = ["english", "american", "british"];

/** Inflected forms the plural/past-tense filter gets wrong: real base words. */
const KEEP = new Set(["alias", "atlas", "basis", "bonus", "chaos", "focus", "lotus", "minus", "oasis", "sinus", "virus", "bleed", "breed", "creed", "greed", "naked", "speed", "steed", "tweed"]);

/** Offensive, sexual or otherwise unwelcome as a forced answer. Still valid guesses. */
const ANSWER_BLOCKLIST = new Set(
  readFileSync(new URL("./answer-blocklist.txt", import.meta.url), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#")),
);

const isFiveLetters = (word) => /^[a-z]{5}$/.test(word);

function readScowl(levels) {
  const words = new Set();
  for (const variant of VARIANTS) {
    for (const level of levels) {
      const file = path.join(scowlDir, `${variant}-words-${level}.json`);
      for (const word of JSON.parse(readFileSync(file, "utf8"))) words.add(word);
    }
  }
  return words;
}

const enable = new Set(
  readFileSync(enablePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim()),
);

/** True for simple plurals and past tenses, which make dull, guessy answers. */
function isInflected(word) {
  if (KEEP.has(word)) return false;
  if (word.endsWith("s") && !word.endsWith("ss")) {
    if (enable.has(word.slice(0, -1))) return true;
    if (word.endsWith("es") && enable.has(word.slice(0, -2))) return true;
    if (word.endsWith("ies") && enable.has(`${word.slice(0, -3)}y`)) return true;
  }
  if (word.endsWith("ed")) {
    if (enable.has(word.slice(0, -1)) || enable.has(word.slice(0, -2))) return true;
    if (enable.has(`${word.slice(0, -3)}y`) && word.endsWith("ied")) return true;
    // Doubled consonant: "ripped" style forms.
    if (word[2] === word[1] && enable.has(word.slice(0, 2))) return true;
  }
  return false;
}

const answers = [...readScowl(ANSWER_LEVELS)]
  .filter(isFiveLetters)
  .filter((word) => enable.has(word)) // drops abbreviations and oddities
  .filter((word) => !isInflected(word))
  .filter((word) => !ANSWER_BLOCKLIST.has(word))
  .sort();

const guesses = [
  ...new Set([
    ...answers,
    ...[...enable].filter(isFiveLetters),
    ...[...readScowl(GUESS_LEVELS)].filter(isFiveLetters),
  ]),
].sort();

const write = (name, list) =>
  writeFileSync(
    new URL(`../data/en/${name}`, import.meta.url),
    `[\n${list.map((word) => `"${word}"`).join(",\n")}\n]\n`,
  );

write("answers.json", answers);
write("valid-guesses.json", guesses);
console.log(`answers: ${answers.length}, valid guesses: ${guesses.length}`);
