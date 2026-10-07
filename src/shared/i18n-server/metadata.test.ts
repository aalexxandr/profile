import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales, type PageKey } from "@/shared/i18n";

import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import { createPageMetadata } from "./metadata";

const pages: PageKey[] = ["home", "cases", "contacts"];
const dictionaries = { en, ru };

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe.each(pages)("createPageMetadata for %s", (page) => {
  it.each(locales)("uses the %s dictionary texts", async (locale) => {
    const metadata = await createPageMetadata(page, locale);

    expect(metadata.title).toBe(dictionaries[locale].metadata[page].title);
    expect(metadata.description).toBe(
      dictionaries[locale].metadata[page].description,
    );
  });

  it.each(locales)("sets the canonical path for %s", async (locale) => {
    const metadata = await createPageMetadata(page, locale);
    const expectedPath = page === "home" ? `/${locale}` : `/${locale}/${page}`;

    expect(metadata.alternates?.canonical).toBe(expectedPath);
  });

  it("lists every language version and x-default", async () => {
    const metadata = await createPageMetadata(page, "ru");
    const suffix = page === "home" ? "" : `/${page}`;

    expect(metadata.alternates?.languages).toEqual({
      en: `/en${suffix}`,
      ru: `/ru${suffix}`,
      "x-default": `/ru${suffix}`,
    });
  });
});

describe("createPageMetadata", () => {
  it("resolves relative urls against the site url", async () => {
    const metadata = await createPageMetadata("home", "en");

    expect(String(metadata.metadataBase)).toBe("https://example.com/");
  });
});
