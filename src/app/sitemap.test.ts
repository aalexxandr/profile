import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import sitemap from "./sitemap";

const { getCases } = vi.hoisted(() => ({ getCases: vi.fn() }));

vi.mock("@/views/cases", () => ({ getCases }));

const slugs = ["spectre", "orbit"];

beforeEach(() => {
  getCases.mockResolvedValue(slugs.map((slug) => ({ slug })));
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("has an entry for every page and every case in every locale", async () => {
    expect((await sitemap()).map(({ url }) => url)).toEqual([
      "https://example.com/ru",
      "https://example.com/en",
      "https://example.com/ru/cases",
      "https://example.com/en/cases",
      "https://example.com/ru/contacts",
      "https://example.com/en/contacts",
      "https://example.com/ru/cases/spectre",
      "https://example.com/en/cases/spectre",
      "https://example.com/ru/cases/orbit",
      "https://example.com/en/cases/orbit",
    ]);
  });

  it("links every entry to all language versions including x-default", async () => {
    for (const entry of await sitemap()) {
      expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual([
        "en",
        "ru",
        "x-default",
      ]);
    }
  });

  it("gives the same alternates to both locales of a page", async () => {
    const [ruHome, enHome] = await sitemap();

    expect(ruHome?.alternates).toEqual(enHome?.alternates);
    expect(ruHome?.alternates?.languages).toEqual({
      en: "https://example.com/en",
      ru: "https://example.com/ru",
      "x-default": "https://example.com/ru",
    });
  });

  it("sets lastModified to a date", async () => {
    for (const { lastModified } of await sitemap()) {
      expect(lastModified).toBeInstanceOf(Date);
    }
  });

  it("links a case page to all its language versions", async () => {
    const entry = (await sitemap()).find(
      ({ url }) => url === "https://example.com/en/cases/spectre",
    );

    expect(entry?.alternates?.languages).toEqual({
      en: "https://example.com/en/cases/spectre",
      ru: "https://example.com/ru/cases/spectre",
      "x-default": "https://example.com/ru/cases/spectre",
    });
  });

  it("reads the case slugs from the backend list of the default locale", async () => {
    await sitemap();

    expect(getCases).toHaveBeenCalledWith("ru");
  });

  it("fails when the backend list cannot be loaded", async () => {
    getCases.mockRejectedValue(new Error("boom"));

    await expect(sitemap()).rejects.toThrow("boom");
  });
});
