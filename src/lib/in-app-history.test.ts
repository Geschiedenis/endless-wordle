import { describe, expect, it } from "vitest";

describe("in-app history", () => {
  it("only allows going back after moving to another page", async () => {
    const { canGoBackInApp, recordPageVisit } = await import("./in-app-history");
    recordPageVisit("/settings");
    recordPageVisit("/settings");
    expect(canGoBackInApp()).toBe(false);
    recordPageVisit("/play");
    expect(canGoBackInApp()).toBe(true);
  });
});
