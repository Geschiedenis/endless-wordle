import { describe, expect, it } from "vitest";
import { dailyAnswer, dailyStatus, toDailyView } from "./daily";
import { ANSWERS } from "./words";

const SECRET = "x".repeat(32);

describe("dailyAnswer", () => {
  it("gives everyone the same word on the same day", () => {
    expect(dailyAnswer("en", "2026-11-07", SECRET)).toBe(dailyAnswer("en", "2026-11-07", SECRET));
  });

  it("is a real answer in the day's language", () => {
    for (const language of ["en", "nl", "de", "fr", "es"] as const) {
      expect(ANSWERS[language]).toContain(dailyAnswer(language, "2026-11-07", SECRET));
    }
  });

  it("doesn't repeat a word for a long time", () => {
    const words = Array.from({ length: 365 }, (_, i) => {
      const day = new Date(Date.UTC(2026, 10, 7 + i)).toISOString().slice(0, 10);
      return dailyAnswer("en", day, SECRET);
    });
    expect(new Set(words).size).toBe(365);
  });

  it("depends on the secret, so the word list alone doesn't give it away", () => {
    const days = ["2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10"];
    const withOther = days.map((day) => dailyAnswer("en", day, "y".repeat(32)));
    expect(days.map((day) => dailyAnswer("en", day, SECRET))).not.toEqual(withOther);
  });
});

describe("dailyStatus and toDailyView", () => {
  it("is over once the word is solved or six guesses are used", () => {
    expect(dailyStatus([], "crane")).toBe("playing");
    expect(dailyStatus(["stone", "crane"], "crane")).toBe("solved");
    expect(dailyStatus(Array(6).fill("stone"), "crane")).toBe("lost");
    expect(dailyStatus(Array(5).fill("stone"), "crane")).toBe("playing");
  });

  it("only shows the answer once the day's game is over", () => {
    expect(toDailyView("en", "2026-11-07", ["stone"], "crane").answer).toBeUndefined();
    expect(toDailyView("en", "2026-11-07", ["crane"], "crane")).toMatchObject({ status: "solved", answer: "crane", number: 1 });
  });
});
