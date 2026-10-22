import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";
import type { CaseDetail } from "@/views/case-details/api/types";

import { CaseHeader } from "./CaseHeader";

type MockImageProps = { alt: string; blurDataURL?: string; src: string };

vi.mock("next/image", () => ({
  default: ({ alt, blurDataURL, src }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} data-blur={blurDataURL} src={src} />
  ),
}));

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const caseItem: CaseDetail = {
  achievements: [],
  backgroundBlurImage: "data:image/png;base64,BBBB",
  backgroundImage: "https://cdn.test/spectre-background.webp",
  blurImage: null,
  category: "FinTech / Web App",
  company: "Spectre Labs",
  description: "A multi-feature service.",
  endedAt: "2024-06-30",
  image: null,
  locale: "en",
  name: "Spectre Explorer",
  projectLink: "https://example.com/spectre",
  role: "FRONTEND",
  shortDescription: "Short",
  slug: "spectre",
  stack: ["React", "TypeScript"],
  startedAt: "2023-03-01",
  teamSize: 6,
};

const renderHeader = (
  overrides: Partial<CaseDetail> = {},
  locale: Locale = "en",
) =>
  render(
    <CaseHeader
      caseItem={{ ...caseItem, ...overrides }}
      cases={dictionaries[locale].pages.cases}
      locale={locale}
    />,
  );

// The details of each part are tested in the tests of its own file: the
// background, the back link, the facts and the lib helpers.
describe("CaseHeader", () => {
  it("has the case name as the only h1", () => {
    renderHeader();

    expect(
      screen.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the category", () => {
    renderHeader();

    expect(screen.getByText("FinTech / Web App")).toBeInTheDocument();
  });

  it.each(locales)(
    "links back to the cases list of the locale in %s",
    (locale) => {
      renderHeader({}, locale);

      expect(
        screen.getByRole("link", {
          name: dictionaries[locale].pages.cases.detail.backToCases,
        }),
      ).toHaveAttribute("href", `/${locale}/cases`);
    },
  );

  it.each(locales)("shows the four facts with their labels in %s", (locale) => {
    const { container } = renderHeader({}, locale);
    const { detail } = dictionaries[locale].pages.cases;

    expect(
      [...container.querySelectorAll("dt")].map((label) => label.textContent),
    ).toEqual([
      detail.roleLabel,
      detail.periodLabel,
      detail.companyLabel,
      detail.teamSizeLabel,
    ]);
    expect(screen.getByText(detail.roles.FRONTEND)).toBeInTheDocument();
    expect(screen.getByText("Spectre Labs")).toBeInTheDocument();
  });

  it("has only the role and the period without a company and a team size", () => {
    const { container } = renderHeader({ company: null, teamSize: null });

    expect(container.querySelectorAll("dt")).toHaveLength(2);
  });

  it("shows the background picture behind the content", () => {
    const { container } = renderHeader();

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://cdn.test/spectre-background.webp",
    );
  });

  it.each(locales)(
    "has no image and no no-image text without a background in %s",
    (locale) => {
      const { container } = renderHeader(
        { backgroundBlurImage: null, backgroundImage: null },
        locale,
      );

      expect(container.querySelector("img")).toBeNull();
      expect(
        screen.queryByText(dictionaries[locale].pages.cases.noImage),
      ).toBeNull();
      expect(
        screen.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
      ).toBeInTheDocument();
    },
  );

  it("does not make the header the containing block of the background", () => {
    const { container } = renderHeader();

    expect(container.querySelector("header")).not.toHaveClass("relative");
  });
});
