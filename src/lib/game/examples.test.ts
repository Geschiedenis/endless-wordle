import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { ANSWERS, isValidGuess } from "@/lib/server/words";
import { HOW_TO_PLAY_EXAMPLES, TIP_EXAMPLES } from "./examples";
import { TIPS } from "@/content/tips";
import { computeFeedback } from "./feedback";

const count = (feedback: string[], state: string) => feedback.filter((f) => f === state).length;

describe.each(LOCALES)("how-to-play example in %s", (locale) => {
  const { first, second, answer, lost } = HOW_TO_PLAY_EXAMPLES[locale];

  it("uses real words from the language's lists", () => {
    for (const word of [first, second]) expect(isValidGuess(word, locale)).toBe(true);
    expect(ANSWERS[locale]).toContain(answer);
    expect(ANSWERS[locale]).toContain(lost);
  });

  it("shows every colour in the first guess", () => {
    const feedback = computeFeedback(first, answer);
    expect(count(feedback, "correct")).toBeGreaterThan(0);
    expect(count(feedback, "present")).toBeGreaterThan(0);
    expect(count(feedback, "absent")).toBeGreaterThan(0);
  });

  it("gets one letter away with the second guess", () => {
    expect(count(computeFeedback(second, answer), "correct")).toBe(4);
  });
});


describe.each(LOCALES)("tips examples in %s", (locale) => {
  const { answer, weak, explore, mover, ending, double } = TIP_EXAMPLES[locale];
  const score = (word: string) => computeFeedback(word, answer);

  it("uses real words from the language's lists", () => {
    expect(ANSWERS[locale]).toContain(answer);
    for (const word of [weak, explore, mover, ending, double]) expect(isValidGuess(word, locale)).toBe(true);
  });

  it("starts with a starter that finds green and yellow letters", () => {
    const feedback = score(TIPS[locale].starters[0]);
    expect(feedback).toContain("correct");
    expect(feedback).toContain("present");
  });

  it("follows a weak guess with five new letters that find more", () => {
    expect(count(score(weak), "absent")).toBe(4);
    expect([...explore].some((letter) => weak.includes(letter))).toBe(false);
    expect(count(score(explore), "absent")).toBeLessThanOrEqual(2);
  });

  it("moves a yellow letter to where it turns green", () => {
    const explored = score(explore);
    const moved = score(mover);
    const turnedGreen = [...explore].some(
      (letter, i) => explored[i] === "present" && [...mover].some((other, j) => other === letter && j !== i && moved[j] === "correct"),
    );
    expect(turnedGreen).toBe(true);
  });

  it("shows a double letter and the common ending", () => {
    expect(new Set(double).size).toBeLessThan(5);
    expect(TIPS[locale].items[4].body.toUpperCase()).toContain(`-${ending.slice(-2).toUpperCase()}`);
  });
});
