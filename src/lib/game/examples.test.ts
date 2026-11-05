import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { ANSWERS, isValidGuess } from "@/lib/server/words";
import { HOW_TO_PLAY_EXAMPLES } from "./examples";
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
