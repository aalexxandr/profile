import { afterEach, describe, expect, it, vi } from "vitest";

import {
  defaultLocale,
  getLocalizedPath,
  getLocalizedPaths,
  getLocalizedUrls,
  getSiteUrl,
  isLocale,
  type PageKey,
} from "@/shared/i18n";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isLocale", () => {
  it.each(["ru", "en"])("accepts supported locale %s", (value) => {
    expect(isLocale(value)).toBe(true);
  });

  it.each(["RU", "", "de", "ru-RU"])("rejects %j", (value) => {
    expect(isLocale(value)).toBe(false);
  });
});

describe("getLocalizedPath", () => {
  it("returns the bare locale for the home page without a trailing slash", () => {
    expect(getLocalizedPath("home", "ru")).toBe("/ru");
    expect(getLocalizedPath("home", "en")).toBe("/en");
  });

  it.each<[PageKey, "ru" | "en", string]>([
    ["cases", "en", "/en/cases"],
    ["cases", "ru", "/ru/cases"],
    ["contacts", "en", "/en/contacts"],
    ["contacts", "ru", "/ru/contacts"],
  ])("builds the %s path for %s", (page, locale, expected) => {
    expect(getLocalizedPath(page, locale)).toBe(expected);
  });
});

describe("getLocalizedPaths", () => {
  it("returns a path per locale and points x-default to the default locale", () => {
    expect(getLocalizedPaths("cases")).toEqual({
      en: "/en/cases",
      ru: "/ru/cases",
      "x-default": `/${defaultLocale}/cases`,
    });
  });

  it("keeps the home page without a trailing slash", () => {
    expect(getLocalizedPaths("home")).toEqual({
      en: "/en",
      ru: "/ru",
      "x-default": `/${defaultLocale}`,
    });
  });
});

describe("getLocalizedUrls", () => {
  it("prefixes every path with the site url", () => {
    expect(getLocalizedUrls("contacts", "https://example.com")).toEqual({
      en: "https://example.com/en/contacts",
      ru: "https://example.com/ru/contacts",
      "x-default": `https://example.com/${defaultLocale}/contacts`,
    });
  });
});

describe("getSiteUrl", () => {
  it("returns NEXT_PUBLIC_SITE_URL when it is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("falls back to localhost outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "development");

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("throws in production when NEXT_PUBLIC_SITE_URL is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => getSiteUrl()).toThrow("NEXT_PUBLIC_SITE_URL is required");
  });

  it("does not throw in production when NEXT_PUBLIC_SITE_URL is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    vi.stubEnv("NODE_ENV", "production");

    expect(getSiteUrl()).toBe("https://example.com");
  });
});
