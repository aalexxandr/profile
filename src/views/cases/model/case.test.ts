import { describe, expect, it } from "vitest";

import { locales } from "@/shared/i18n";

import { getMockCaseItems } from "./case";

describe("getMockCaseItems", () => {
  it("returns the same slugs in the same order for every locale", () => {
    const [firstLocale, ...otherLocales] = locales;
    const expectedSlugs = getMockCaseItems(firstLocale).map(({ slug }) => slug);

    expect(expectedSlugs.length).toBeGreaterThan(0);

    for (const locale of otherLocales) {
      expect(getMockCaseItems(locale).map(({ slug }) => slug)).toEqual(
        expectedSlugs,
      );
    }
  });

  it("has unique slugs", () => {
    const slugs = getMockCaseItems("en").map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(locales)(
    "only uses picsum.photos images for %s (next/image allows no other host)",
    (locale) => {
      for (const { blurImage, image } of getMockCaseItems(locale)) {
        expect(new URL(image).hostname).toBe("picsum.photos");
        expect(new URL(blurImage).hostname).toBe("picsum.photos");
      }
    },
  );

  it.each(locales)("has non-empty texts for %s", (locale) => {
    for (const { name, shortDesc } of getMockCaseItems(locale)) {
      expect(name.trim()).not.toBe("");
      expect(shortDesc.trim()).not.toBe("");
    }
  });
});
