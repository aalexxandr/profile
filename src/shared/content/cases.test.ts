import { describe, expect, it } from "vitest";

import { locales } from "@/shared/i18n";

import { findCase, getCaseList } from "./cases";

describe("case content", () => {
  it("lists the same slugs in every locale", () => {
    const [first, ...rest] = locales.map((locale) =>
      getCaseList(locale).map(({ slug }) => slug),
    );

    for (const slugs of rest) {
      expect(slugs).toEqual(first);
    }
  });

  it("has unique slugs", () => {
    const slugs = getCaseList("ru").map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(locales)("finds each listed case in %s", (locale) => {
    for (const { slug, name } of getCaseList(locale)) {
      expect(findCase(slug, locale)).toMatchObject({ slug, name, locale });
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(findCase("unknown", "en")).toBeUndefined();
  });
});
