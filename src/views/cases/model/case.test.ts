import { describe, expect, it } from "vitest";

import { locales, type Locale } from "@/shared/i18n";

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

  it("has the same objects count for every locale", () => {
    const countsOf = (locale: Locale) =>
      getMockCaseItems(locale).map(({ objectsCount }) => objectsCount);

    expect(countsOf("ru")).toEqual(countsOf("en"));
  });

  // The word next to the count is a fixed dictionary string, so a hand-picked
  // count must read correctly with it: ru "объектов" (many), en "objects" (not 1).
  it.each([
    ["ru", "many"],
    ["en", "other"],
  ] as const)(
    "has counts that agree with the fixed %s word",
    (locale, expectedCategory) => {
      for (const { name, objectsCount } of getMockCaseItems(locale)) {
        expect(Number.isInteger(objectsCount), name).toBe(true);
        expect(new Intl.PluralRules(locale).select(objectsCount), name).toBe(
          expectedCategory,
        );
      }
    },
  );
});
