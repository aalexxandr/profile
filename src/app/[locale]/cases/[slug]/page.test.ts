import { describe, expect, it, vi } from "vitest";

import { getMockCaseItems } from "@/views/cases";
import { locales } from "@/shared/i18n";

import { generateStaticParams } from "./page";

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

vi.mock("next/navigation", () => ({ notFound }));

describe("case page route", () => {
  it.each(locales)(
    "has a page for every case linked from the %s cases list",
    (locale) => {
      const params = generateStaticParams();

      for (const { slug } of getMockCaseItems(locale)) {
        expect(params).toContainEqual({ locale, slug });
      }
    },
  );

  it("does not generate pages for unknown slugs", () => {
    expect(generateStaticParams()).toHaveLength(
      locales.length * getMockCaseItems("en").length,
    );
  });
});
