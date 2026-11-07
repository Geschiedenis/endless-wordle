import { describe, expect, it } from "vitest";
import { dailyNumber, isPlayableDay, localDay, msUntilNextDay } from "./daily";

const at = (iso: string) => Date.parse(iso);

describe("daily word days", () => {
  it("numbers days from the first daily word", () => {
    expect(dailyNumber("2026-11-07")).toBe(1);
    expect(dailyNumber("2026-11-08")).toBe(2);
    expect(dailyNumber("2027-11-07")).toBe(366);
  });

  it("accepts yesterday, today and tomorrow in UTC terms, for every time zone", () => {
    const now = at("2026-11-20T12:00:00Z");
    expect(isPlayableDay("2026-11-19", now)).toBe(true);
    expect(isPlayableDay("2026-11-20", now)).toBe(true);
    expect(isPlayableDay("2026-11-21", now)).toBe(true);
  });

  it("refuses days further away, so nobody can look ahead", () => {
    const now = at("2026-11-20T12:00:00Z");
    expect(isPlayableDay("2026-11-22", now)).toBe(false);
    expect(isPlayableDay("2026-11-18", now)).toBe(false);
  });

  it("refuses days before the first daily word and anything that isn't a day", () => {
    const now = at("2026-11-07T01:00:00Z");
    expect(isPlayableDay("2026-11-06", now)).toBe(false);
    for (const day of ["", "2026-11-7", "2026-02-31", "tomorrow", "2026-11-07T00:00"]) {
      expect(isPlayableDay(day, now), day).toBe(false);
    }
  });

  it("uses the browser's own calendar day", () => {
    expect(localDay(new Date(2026, 10, 7, 23, 59))).toBe("2026-11-07");
    expect(localDay(new Date(2026, 0, 2, 0, 1))).toBe("2026-01-02");
  });

  it("counts down to the next local midnight", () => {
    expect(msUntilNextDay(new Date(2026, 10, 7, 23, 0, 0))).toBe(60 * 60 * 1000);
  });
});
