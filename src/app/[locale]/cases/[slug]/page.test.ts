import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";
import { locales } from "@/shared/i18n";

import { generateMetadata, generateStaticParams } from "./page";

const { getCase, getCases, notFound } = vi.hoisted(() => ({
  getCase: vi.fn(),
  getCases: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

vi.mock("next/navigation", () => ({ notFound }));
vi.mock("@/views/cases", () => ({ getCases }));
vi.mock("@/views/case-details", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getCase,
}));

const listItem = (slug: string) => ({ slug });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

describe("case page route", () => {
  it("has a page for every backend case in every locale", async () => {
    getCases.mockResolvedValue([listItem("spectre"), listItem("orbit")]);

    const params = await generateStaticParams();

    expect(params).toHaveLength(locales.length * 2);
    for (const locale of locales) {
      expect(getCases).toHaveBeenCalledWith(locale);
      expect(params).toContainEqual({ locale, slug: "spectre" });
      expect(params).toContainEqual({ locale, slug: "orbit" });
    }
  });

  it("fails the build when the backend list cannot be loaded", async () => {
    getCases.mockRejectedValue(new ApiError(500, "boom"));

    await expect(generateStaticParams()).rejects.toThrow("boom");
  });

  it("builds the metadata from the backend case", async () => {
    getCase.mockResolvedValue({
      name: "Spectre Explorer",
      shortDescription: "Short",
      slug: "spectre",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "spectre" }),
    });

    expect(getCase).toHaveBeenCalledWith("spectre", "en");
    expect(metadata.title).toBe("Spectre Explorer");
  });

  it("answers not-found when the backend has no such case", async () => {
    getCase.mockRejectedValue(new ApiError(404, "Case not found"));

    await expect(
      generateMetadata({
        params: Promise.resolve({ locale: "en", slug: "missing" }),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(notFound).toHaveBeenCalled();
  });

  it("rethrows other backend errors instead of hiding them as not-found", async () => {
    getCase.mockRejectedValue(new ApiError(500, "boom"));

    await expect(
      generateMetadata({
        params: Promise.resolve({ locale: "en", slug: "spectre" }),
      }),
    ).rejects.toThrow("boom");
    expect(notFound).not.toHaveBeenCalled();
  });
});
