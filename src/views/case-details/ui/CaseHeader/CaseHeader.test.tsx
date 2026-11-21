import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";
import type { CaseDetail } from "@/views/case-details/api/types";

import { CaseHeader } from "./CaseHeader";

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const caseItem: CaseDetail = {
  achievements: [],
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
// back link, the facts and the lib helpers.
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

  it.each(locales)("shows the product role label in %s", (locale) => {
    renderHeader({ role: "PRODUCT" }, locale);

    expect(screen.getByText("Product engineer")).toBeInTheDocument();
  });

  it("has only the role and the period without a company and a team size", () => {
    const { container } = renderHeader({ company: null, teamSize: null });

    expect(container.querySelectorAll("dt")).toHaveLength(2);
  });

  it.each(locales)("shows no picture and no no-image text in %s", (locale) => {
    const { container } = renderHeader({}, locale);

    expect(container.querySelector("img")).toBeNull();
    expect(
      screen.queryByText(dictionaries[locale].pages.cases.noImage),
    ).toBeNull();
  });

  it("reserves no height for a picture", () => {
    const { container } = renderHeader();
    const reserved = [...container.querySelectorAll("header *")].filter(
      (element) =>
        [...element.classList].some((name) => /(^|:)min-h-/.test(name)),
    );

    expect(reserved).toEqual([]);
    expect(container.querySelector("header > *")).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it("brings in the back link, the name and the facts one after another on load", () => {
    const { container } = renderHeader();
    const backLink = screen.getByRole("link", {
      name: en.pages.cases.detail.backToCases,
    }).parentElement;
    const title = screen.getByRole("heading", { level: 1 }).parentElement;
    const facts = container.querySelector("dl")?.parentElement;

    expect(backLink).toHaveClass("animate-reveal-down");
    expect(backLink?.style.animationDelay).toBe("80ms");
    expect(title).toHaveClass("animate-reveal-up");
    expect(title).toContainElement(screen.getByText("FinTech / Web App"));
    expect(title?.style.animationDelay).toBe("160ms");
    expect(facts).toHaveClass("animate-reveal-up");
    expect(facts?.style.animationDelay).toBe("260ms");
    for (const block of [backLink, title, facts]) {
      expect(block).not.toHaveClass("[animation-play-state:paused]");
    }
  });
});
