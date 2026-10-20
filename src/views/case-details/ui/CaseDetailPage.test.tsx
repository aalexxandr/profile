import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import type { CaseDetail } from "../api/types";
import { CaseDetailPage } from "./CaseDetailPage";

type MockImageProps = { alt: string; blurDataURL?: string; src: string };

vi.mock("next/image", () => ({
  default: ({ alt, blurDataURL, src }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} data-blur={blurDataURL} src={src} />
  ),
}));

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const caseItem: CaseDetail = {
  achievements: [
    { description: "Faster reviews", metric: "-40%", title: "Reporting" },
    { description: "Reusable states", metric: "30+", title: "UI states" },
  ],
  blurImage: "data:image/png;base64,AAAA",
  category: "FinTech / Web App",
  company: "Spectre Labs",
  description: "A multi-feature service.",
  endedAt: "2024-06-30",
  image: "https://cdn.test/spectre.webp",
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

const renderPage = (
  overrides: Partial<CaseDetail> = {},
  locale: Locale = "en",
) => {
  const item = { ...caseItem, ...overrides };

  render(
    <CaseDetailPage
      caseItem={item}
      cases={dictionaries[locale].pages.cases}
      locale={locale}
    />,
  );

  return item;
};

const formatMonth = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date));

describe("CaseDetailPage", () => {
  it("has the case name as the only h1", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the description, stack and category", () => {
    renderPage();

    expect(screen.getByText("A multi-feature service.")).toBeInTheDocument();
    expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
    expect(screen.getByText("FinTech / Web App")).toBeInTheDocument();
  });

  it.each(locales)("shows the role label in %s", (locale) => {
    renderPage({}, locale);

    expect(
      screen.getByText(dictionaries[locale].pages.cases.detail.roles.FRONTEND),
    ).toBeInTheDocument();
    expect(screen.queryByText("FRONTEND")).not.toBeInTheDocument();
  });

  it("labels the fullstack role", () => {
    renderPage({ role: "FULLSTACK" });

    expect(screen.getByText("Fullstack developer")).toBeInTheDocument();
  });

  it.each(locales)("shows company, team size and period in %s", (locale) => {
    renderPage({}, locale);
    const { detail } = dictionaries[locale].pages.cases;

    expect(screen.getByText(detail.companyLabel)).toBeInTheDocument();
    expect(screen.getByText("Spectre Labs")).toBeInTheDocument();
    expect(screen.getByText(detail.teamSizeLabel)).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText(detail.periodLabel)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${formatMonth("2023-03-01", locale)} – ${formatMonth("2024-06-30", locale)}`,
      ),
    ).toBeInTheDocument();
  });

  it("hides the company and team size when they are null", () => {
    renderPage({ company: null, teamSize: null });

    expect(screen.queryByText("Company")).not.toBeInTheDocument();
    expect(screen.queryByText("Team size")).not.toBeInTheDocument();
  });

  it.each(locales)("reads an open period as present in %s", (locale) => {
    renderPage({ endedAt: null }, locale);

    expect(
      screen.getByText(
        `${formatMonth("2023-03-01", locale)} – ${dictionaries[locale].pages.cases.detail.periodPresent}`,
      ),
    ).toBeInTheDocument();
  });

  it("lists every achievement", () => {
    renderPage();
    const list = screen.getByRole("list");

    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(within(list).getByText("Reusable states")).toBeInTheDocument();
  });

  it("opens the project in a new tab with a descriptive name", () => {
    renderPage();
    const link = screen.getByRole("link", {
      name: "Project link: Spectre Explorer",
    });

    expect(link).toHaveAttribute("href", "https://example.com/spectre");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("links back to the cases list in the same locale", () => {
    renderPage({}, "ru");

    expect(
      screen.getByRole("link", {
        name: ru.pages.cases.detail.backToCases,
      }),
    ).toHaveAttribute("href", "/ru/cases");
  });

  it("shows the picture with a blur preview", () => {
    renderPage();
    const image = screen.getByRole("img", { name: "Spectre Explorer" });

    expect(image).toHaveAttribute("src", "https://cdn.test/spectre.webp");
    expect(image).toHaveAttribute("data-blur", "data:image/png;base64,AAAA");
  });

  it("shows the picture without a blur preview when it is null", () => {
    renderPage({ blurImage: null });

    expect(screen.getByRole("img")).not.toHaveAttribute("data-blur");
  });

  it.each(locales)("shows the no-image text in %s", (locale) => {
    renderPage({ blurImage: null, image: null }, locale);

    expect(
      screen.getByText(dictionaries[locale].pages.cases.noImage),
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
