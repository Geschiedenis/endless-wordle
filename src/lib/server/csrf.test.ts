import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./csrf";

function request(headers: Record<string, string>) {
  return new Request("https://example.com/api/x", { method: "POST", headers });
}

describe("isSameOrigin", () => {
  it("accepts the site's own origin", () => {
    expect(isSameOrigin(request({ origin: "https://wordle.example", host: "wordle.example" }))).toBe(true);
  });

  it("uses the forwarded host behind a proxy", () => {
    const headers = { origin: "https://wordle.example", host: "internal", "x-forwarded-host": "wordle.example" };
    expect(isSameOrigin(request(headers))).toBe(true);
  });

  it.each([
    ["another site", { origin: "https://evil.example", host: "wordle.example" }],
    ["a lookalike subdomain", { origin: "https://wordle.example.evil.example", host: "wordle.example" }],
    ["a different port", { origin: "https://wordle.example:444", host: "wordle.example" }],
    ["no Origin header", { host: "wordle.example" }],
    ["a malformed Origin", { origin: "not a url", host: "wordle.example" }],
    ["a null Origin", { origin: "null", host: "wordle.example" }],
  ])("rejects %s", (_label, headers) => {
    expect(isSameOrigin(request(headers))).toBe(false);
  });
});
