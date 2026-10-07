import { describe, expect, it } from "vitest";

import { locales } from "@/shared/i18n";

import { getMockCaseItems } from "./case";
import { getMockCase } from "./case-full";

describe("getMockCase", () => {
  it.each(locales)(
    "has full details for every case shown in the %s list",
    (locale) => {
      for (const { slug } of getMockCaseItems(locale)) {
        expect(getMockCase(locale, slug), slug).toBeDefined();
      }
    },
  );

  it("returns undefined for an unknown slug", () => {
    expect(getMockCase("en", "does-not-exist")).toBeUndefined();
    expect(getMockCase("ru", "")).toBeUndefined();
  });

  it("keeps the list fields and adds the detail fields", () => {
    const [listItem] = getMockCaseItems("en");
    const caseItem = getMockCase("en", listItem?.slug ?? "");

    expect(caseItem).toMatchObject({
      image: listItem?.image,
      name: listItem?.name,
      projectLink: listItem?.projectLink,
      shortDescription: listItem?.shortDesc,
      slug: listItem?.slug,
    });
    expect(caseItem?.stack.length).toBeGreaterThan(0);
    expect(caseItem?.achievements.length).toBeGreaterThan(0);
  });

  it.each(locales)("has no empty texts for %s", (locale) => {
    for (const { slug } of getMockCaseItems(locale)) {
      const caseItem = getMockCase(locale, slug);

      expect(caseItem?.category.trim()).toBeTruthy();
      expect(caseItem?.description.trim()).toBeTruthy();
      expect(caseItem?.role.trim()).toBeTruthy();

      for (const { description, metric, title } of caseItem?.achievements ??
        []) {
        expect(description.trim()).toBeTruthy();
        expect(metric.trim()).toBeTruthy();
        expect(title.trim()).toBeTruthy();
      }
    }
  });
});
