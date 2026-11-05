import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { WORD_LENGTH } from "@/lib/game/constants";
import { LANGUAGES, parseGuess } from "@/lib/game/languages";
import { ANSWERS, isValidGuess, newSeed, wordAt } from "./words";
import enGuesses from "../../../data/en/valid-guesses.json";
import nlGuesses from "../../../data/nl/valid-guesses.json";
import deGuesses from "../../../data/de/valid-guesses.json";
import frGuesses from "../../../data/fr/valid-guesses.json";
import esGuesses from "../../../data/es/valid-guesses.json";

const GUESSES = { en: enGuesses, nl: nlGuesses, de: deGuesses, fr: frGuesses, es: esGuesses };

describe.each(LOCALES)("%s word lists", (locale) => {
  const answers = ANSWERS[locale];
  const guesses: string[] = GUESSES[locale];
  const letters = new Set(LANGUAGES[locale].letters);
  const inAlphabet = (word: string) => [...word].length === WORD_LENGTH && [...word].every((c) => letters.has(c));

  it("contains only words of the language's letters, of the right length", () => {
    expect(answers.every(inAlphabet)).toBe(true);
    expect(guesses.every(inAlphabet)).toBe(true);
  });

  it("can be typed: every word comes back unchanged from guess parsing", () => {
    expect(guesses.every((word) => parseGuess(word, locale) === word)).toBe(true);
  });

  it("has no duplicates", () => {
    expect(new Set(answers).size).toBe(answers.length);
    expect(new Set(guesses).size).toBe(guesses.length);
  });

  it("is sized as intended, with guesses larger than answers", () => {
    expect(answers.length).toBeGreaterThan(1000);
    expect(guesses.length).toBeGreaterThan(answers.length);
  });

  it("accepts every answer as a guess", () => {
    expect(answers.every((word) => isValidGuess(word, locale))).toBe(true);
  });
});

describe("isValidGuess", () => {
  it("rejects words that are not in the list", () => {
    expect(isValidGuess("zzzzz")).toBe(false);
  });

  it("checks the game's own language", () => {
    expect(isValidGuess("fiets", "nl")).toBe(true);
    expect(isValidGuess("fiets", "en")).toBe(false);
  });
});

describe("wordAt", () => {
  const list = ["apple", "brave", "crane", "delta", "eagle"];

  it("is stable for the same seed and position", () => {
    expect(wordAt("seed", 3, list)).toBe(wordAt("seed", 3, list));
  });

  it("does not repeat within a pass through the list", () => {
    const seen = list.map((_, i) => wordAt("seed", i, list));
    expect(new Set(seen).size).toBe(list.length);
  });

  it("does not repeat across the real answer list", () => {
    const positions = Array.from({ length: 50 }, (_, i) => wordAt("seed", i));
    expect(new Set(positions).size).toBe(50);
  });

  it("orders words differently per seed", () => {
    const order = (seed: string) => list.map((_, i) => wordAt(seed, i, list)).join();
    const orders = new Set(["a", "b", "c", "d", "e", "f"].map(order));
    expect(orders.size).toBeGreaterThan(1);
  });

  it("keeps working after the list is exhausted", () => {
    expect(list).toContain(wordAt("seed", list.length + 2, list));
  });
});

describe("newSeed", () => {
  it("is unique per call", () => {
    expect(newSeed()).not.toBe(newSeed());
  });
});
