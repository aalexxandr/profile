import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";

import { getMockCase } from "../model/case-full";
import { createCaseMetadata } from "./createCaseMetadata";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createCaseMetadata", () => {
  it.each(locales)("uses the case texts for %s", (locale) => {
    const caseItem = getMockCase(locale, "product-ui");

    if (!caseItem) {
      throw new Error("Expected the product-ui mock case to exist");
    }

    const metadata = createCaseMetadata(caseItem, locale);

    expect(metadata.title).toBe(caseItem.name);
    expect(metadata.description).toBe(caseItem.shortDescription);
    expect(metadata.alternates?.canonical).toBe(`/${locale}/cases/product-ui`);
  });

  it("lists every language version and x-default", () => {
    const caseItem = getMockCase("en", "booking-flow");

    if (!caseItem) {
      throw new Error("Expected the booking-flow mock case to exist");
    }

    expect(createCaseMetadata(caseItem, "en").alternates?.languages).toEqual({
      en: "/en/cases/booking-flow",
      ru: "/ru/cases/booking-flow",
      "x-default": "/ru/cases/booking-flow",
    });
  });
});
