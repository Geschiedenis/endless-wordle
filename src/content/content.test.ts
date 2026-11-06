import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { ANSWERS } from "@/lib/server/words";
import { FAQ } from "./faq";
import { TIPS } from "./tips";

describe.each(LOCALES)("%s FAQ and tips", (locale) => {
  it("suggests starting words that are real answers with five different letters", () => {
    for (const word of TIPS[locale].starters) {
      expect(ANSWERS[locale]).toContain(word);
      expect(new Set(word).size).toBe(5);
    }
  });

  it("names each starting word in the first tip", () => {
    for (const word of TIPS[locale].starters) expect(TIPS[locale].items[0].body).toContain(word.toUpperCase());
  });

  it("only uses link placeholders the page knows", () => {
    const text = [FAQ[locale].intro, ...FAQ[locale].items.map((item) => item.answer)].join(" ");
    const placeholders = text.match(/\{(\w+)\}/g) ?? [];
    for (const placeholder of placeholders) expect(["{howToPlay}", "{tips}", "{privacy}"]).toContain(placeholder);
  });

  it("has the same number of questions and tips as English", () => {
    expect(FAQ[locale].items).toHaveLength(FAQ.en.items.length);
    expect(TIPS[locale].items).toHaveLength(TIPS.en.items.length);
  });
});
