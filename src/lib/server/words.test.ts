import { describe, expect, it } from "vitest";
import answers from "../../../data/answers.json";
import validGuesses from "../../../data/valid-guesses.json";
import { WORD_LENGTH } from "@/lib/game/constants";
import { isValidGuess, newSeed, wordAt } from "./words";

describe("word list data", () => {
  const shape = new RegExp(`^[a-z]{${WORD_LENGTH}}$`);

  it("contains only lowercase words of the right length", () => {
    expect(answers.every((word) => shape.test(word))).toBe(true);
    expect(validGuesses.every((word) => shape.test(word))).toBe(true);
  });

  it("has no duplicates", () => {
    expect(new Set(answers).size).toBe(answers.length);
    expect(new Set(validGuesses).size).toBe(validGuesses.length);
  });

  it("is sized as intended, with guesses larger than answers", () => {
    expect(answers.length).toBeGreaterThan(1500);
    expect(validGuesses.length).toBeGreaterThan(answers.length);
  });

  it("accepts every answer as a guess", () => {
    expect(answers.every(isValidGuess)).toBe(true);
  });
});

describe("isValidGuess", () => {
  it("rejects words that are not in the list", () => {
    expect(isValidGuess("zzzzz")).toBe(false);
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
