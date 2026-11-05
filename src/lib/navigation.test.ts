import { describe, expect, it } from "vitest";
import { safeNextPath } from "./navigation";

describe("safeNextPath", () => {
  it("keeps known pages", () => {
    expect(safeNextPath("/profile")).toBe("/profile");
    expect(safeNextPath("/reset-password")).toBe("/reset-password");
  });

  it.each([
    null,
    undefined,
    "",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/play/../../evil",
    "/profile?x=1",
    "javascript:alert(1)",
  ])("falls back to the game for %s", (value) => {
    expect(safeNextPath(value)).toBe("/play");
  });
});
