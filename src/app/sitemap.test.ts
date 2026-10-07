import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import sitemap from "./sitemap";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("has an entry for every page in every locale", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://example.com/ru",
      "https://example.com/en",
      "https://example.com/ru/cases",
      "https://example.com/en/cases",
      "https://example.com/ru/contacts",
      "https://example.com/en/contacts",
    ]);
  });

  it("links every entry to all language versions including x-default", () => {
    for (const entry of sitemap()) {
      expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual([
        "en",
        "ru",
        "x-default",
      ]);
    }
  });

  it("gives the same alternates to both locales of a page", () => {
    const [ruHome, enHome] = sitemap();

    expect(ruHome?.alternates).toEqual(enHome?.alternates);
    expect(ruHome?.alternates?.languages).toEqual({
      en: "https://example.com/en",
      ru: "https://example.com/ru",
      "x-default": "https://example.com/ru",
    });
  });

  it("sets lastModified to a date", () => {
    for (const { lastModified } of sitemap()) {
      expect(lastModified).toBeInstanceOf(Date);
    }
  });
});
