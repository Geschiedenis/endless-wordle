import { describe, expect, it } from "vitest";
import { suggestLocale } from "./suggest";

describe("suggestLocale", () => {
  it("offers Dutch to someone in the Netherlands on the English site, even with an English browser", () => {
    expect(suggestLocale({ current: "en", country: "NL", browserLanguages: ["en-US"] })).toBe("nl");
  });

  it("leaves people alone who are already reading their country's language", () => {
    expect(suggestLocale({ current: "nl", country: "NL", browserLanguages: ["en-US"] })).toBeNull();
    expect(suggestLocale({ current: "es", country: "MX", browserLanguages: ["es-MX"] })).toBeNull();
  });

  it("falls back to the browser's language where the country doesn't say", () => {
    expect(suggestLocale({ current: "en", country: "BE", browserLanguages: ["fr-BE", "nl"] })).toBe("fr");
    expect(suggestLocale({ current: "en", country: null, browserLanguages: ["de-CH"] })).toBe("de");
  });

  it("skips browser languages the site doesn't have", () => {
    expect(suggestLocale({ current: "en", country: "CH", browserLanguages: ["it-CH", "de"] })).toBe("de");
    expect(suggestLocale({ current: "en", country: null, browserLanguages: ["it", "pt"] })).toBeNull();
  });

  it("offers English to someone in the US who landed on another language", () => {
    expect(suggestLocale({ current: "nl", country: "us", browserLanguages: [] })).toBe("en");
  });
});
