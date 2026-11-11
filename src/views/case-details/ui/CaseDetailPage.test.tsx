import { render, screen } from "@testing-library/react";
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
  backgroundBlurImage: null,
  backgroundImage: "https://cdn.test/spectre-background.webp",
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

  return render(
    <CaseDetailPage
      caseItem={item}
      cases={dictionaries[locale].pages.cases}
      locale={locale}
    />,
  );
};

const follows = (first: HTMLElement, second: HTMLElement) =>
  Boolean(
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING,
  );

describe("CaseDetailPage", () => {
  it("has the case name as the only h1", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it.each(locales)(
    "shows the header, about, stack and achievements in order in %s",
    (locale) => {
      renderPage({}, locale);
      const { detail } = dictionaries[locale].pages.cases;
      const title = screen.getByRole("heading", { level: 1 });
      const about = screen.getByRole("region", { name: detail.aboutTitle });
      const stack = screen.getByRole("region", { name: detail.stackTitle });
      const achievements = screen.getByRole("region", {
        name: detail.achievementsTitle,
      });

      expect(follows(title, about)).toBe(true);
      expect(follows(about, stack)).toBe(true);
      expect(follows(stack, achievements)).toBe(true);
    },
  );

  it("does not render or request the case picture", () => {
    const { container } = renderPage();
    const sources = [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("src"),
    );

    expect(sources).toEqual(["https://cdn.test/spectre-background.webp"]);
    expect(
      screen.queryByRole("img", { name: "Spectre Explorer" }),
    ).not.toBeInTheDocument();
  });

  it.each(locales)("has no retro window controls in %s", (locale) => {
    renderPage({}, locale);
    const { controlLabels } = dictionaries[locale].pages.cases;

    expect(
      screen.queryByRole("button", { name: controlLabels.close }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: controlLabels.fullScreen }),
    ).toBeNull();
  });

  it("shows the description, category and the stack items", () => {
    renderPage();

    expect(screen.getByText("A multi-feature service.")).toBeInTheDocument();
    expect(screen.getByText("FinTech / Web App")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("opens the project in a new tab with a descriptive name", () => {
    renderPage();
    const link = screen.getByRole("link", {
      name: "Project link: Spectre Explorer",
    });

    expect(link).toHaveAttribute("href", "https://example.com/spectre");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("links back to the cases list in the same locale", () => {
    renderPage({}, "ru");

    expect(
      screen.getByRole("link", { name: ru.pages.cases.detail.backToCases }),
    ).toHaveAttribute("href", "/ru/cases");
  });

  it("hides the company and team size when they are null", () => {
    renderPage({ company: null, teamSize: null });

    expect(screen.queryByText(en.pages.cases.detail.companyLabel)).toBeNull();
    expect(screen.queryByText(en.pages.cases.detail.teamSizeLabel)).toBeNull();
  });

  it.each(locales)(
    "shows no no-image text and no picture for a case without images in %s",
    (locale) => {
      renderPage(
        {
          backgroundBlurImage: null,
          backgroundImage: null,
          blurImage: null,
          image: null,
        },
        locale,
      );

      expect(
        screen.queryByText(dictionaries[locale].pages.cases.noImage),
      ).toBeNull();
      expect(screen.queryByRole("img")).toBeNull();
    },
  );

  it("omits the achievements section without achievements", () => {
    renderPage({ achievements: [] });

    expect(
      screen.queryByRole("region", {
        name: en.pages.cases.detail.achievementsTitle,
      }),
    ).toBeNull();
  });
});
