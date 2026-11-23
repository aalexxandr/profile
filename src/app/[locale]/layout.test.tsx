import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { PageErrorBoundary } from "@/views/error-pages";
import { getDictionary } from "@/shared/i18n-server";

import { SiteLayout } from "../_layout/SiteLayout";
import LocaleLayout from "./layout";

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "font-variable" }),
}));

type Element = ReactElement<{ children: ReactNode } & Record<string, unknown>>;

describe("locale layout", () => {
  it.each(["ru", "en"] as const)(
    "puts the %s page in the error boundary with its error screen texts inside the site layout",
    async (locale) => {
      const page = <p>page</p>;
      const siteLayout = (await LocaleLayout({
        children: page,
        params: Promise.resolve({ locale }),
      })) as Element;
      const boundary = siteLayout.props.children as Element;

      expect(siteLayout.type).toBe(SiteLayout);
      expect(boundary.type).toBe(PageErrorBoundary);
      expect(boundary.props.locale).toBe(locale);
      expect(boundary.props.texts).toEqual(
        (await getDictionary(locale)).errors.serverError,
      );
      expect(boundary.props.children).toBe(page);
    },
  );
});
