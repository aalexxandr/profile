import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";

import type { CaseDetail } from "../api/types";
import { createCaseMetadata } from "./createCaseMetadata";

const caseItem = {
  name: "Spectre Explorer",
  shortDescription: "A large service for browsing blockchain operations.",
  slug: "spectre",
} as CaseDetail;

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createCaseMetadata", () => {
  it.each(locales)("uses the case texts for %s", (locale) => {
    const metadata = createCaseMetadata(caseItem, locale);

    expect(metadata.title).toBe("Spectre Explorer");
    expect(metadata.description).toBe(caseItem.shortDescription);
    expect(metadata.alternates?.canonical).toBe(`/${locale}/cases/spectre`);
  });

  it("lists every language version and x-default", () => {
    expect(createCaseMetadata(caseItem, "en").alternates?.languages).toEqual({
      en: "/en/cases/spectre",
      ru: "/ru/cases/spectre",
      "x-default": "/ru/cases/spectre",
    });
  });
});
