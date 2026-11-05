import { describe, expect, it } from "vitest";
import { BASE_GUESSES, MAX_BONUS_GUESSES } from "./constants";
import { guessesAllowed, rolloverBonus } from "./rollover";

describe("guessesAllowed", () => {
  it("adds the bonus to the base guesses", () => {
    expect(guessesAllowed(0)).toBe(BASE_GUESSES);
    expect(guessesAllowed(2)).toBe(BASE_GUESSES + 2);
  });
});

describe("rolloverBonus", () => {
  it("rolls over unused guesses: solved in 4 of 6 gives 2", () => {
    expect(rolloverBonus(0, 4)).toBe(2);
    expect(guessesAllowed(rolloverBonus(0, 4))).toBe(8);
  });

  it("gives nothing when every guess was used", () => {
    expect(rolloverBonus(0, 6)).toBe(0);
    expect(rolloverBonus(2, 8)).toBe(0);
  });

  it("accumulates: unused bonus guesses carry over too", () => {
    expect(rolloverBonus(2, 4)).toBe(4);
    expect(rolloverBonus(2, 7)).toBe(1);
  });

  it("caps the bonus", () => {
    expect(rolloverBonus(4, 1)).toBe(MAX_BONUS_GUESSES);
    expect(rolloverBonus(MAX_BONUS_GUESSES, 1)).toBe(MAX_BONUS_GUESSES);
  });

  it("gives exactly the cap when unused equals the cap", () => {
    expect(rolloverBonus(1, 1)).toBe(6);
  });

  it("respects a different cap", () => {
    expect(rolloverBonus(0, 1, 3)).toBe(3);
  });

  it("never goes negative", () => {
    expect(rolloverBonus(0, 7)).toBe(0);
  });
});
