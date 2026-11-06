import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { FAQ } from "./faq";
import { HOME_FAQ_ITEMS } from "./home";

describe("home page FAQ", () => {
  it("picks questions that exist in every language", () => {
    for (const locale of LOCALES) {
      for (const index of HOME_FAQ_ITEMS) expect(FAQ[locale].items[index], `${locale} #${index}`).toBeDefined();
    }
  });
});
