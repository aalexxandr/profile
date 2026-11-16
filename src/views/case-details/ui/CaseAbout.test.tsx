import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import type { CaseDetail } from "../api/types";
import { CaseAbout } from "./CaseAbout";

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const caseItem: Pick<CaseDetail, "description" | "name" | "projectLink"> = {
  description: "A multi-feature service.",
  name: "Spectre Explorer",
  projectLink: "https://example.com/spectre",
};

const renderAbout = (locale: Locale = "en", item: typeof caseItem = caseItem) =>
  render(
    <CaseAbout caseItem={item} cases={dictionaries[locale].pages.cases} />,
  );

describe("CaseAbout", () => {
  it.each(locales)("is titled and shows the description in %s", (locale) => {
    renderAbout(locale);
    const { detail } = dictionaries[locale].pages.cases;
    const section = screen.getByRole("region", { name: detail.aboutTitle });

    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: detail.aboutTitle,
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText("A multi-feature service."),
    ).toBeInTheDocument();
  });

  it.each(locales)(
    "opens the project in a new tab with a descriptive name in %s",
    (locale) => {
      renderAbout(locale);
      const { actions } = dictionaries[locale].pages.cases;
      const link = screen.getByRole("link", {
        name: `${actions.projectLink}: Spectre Explorer`,
      });

      expect(link).toHaveAttribute("href", "https://example.com/spectre");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link).toHaveTextContent(actions.projectLink);
    },
  );

  it.each(locales)(
    "shows the private project label instead of a link in %s",
    (locale) => {
      renderAbout(locale, { ...caseItem, projectLink: null });
      const { actions, detail } = dictionaries[locale].pages.cases;
      const section = screen.getByRole("region", { name: detail.aboutTitle });

      expect(
        within(section).getByText(actions.projectPrivate),
      ).toBeInTheDocument();
      expect(
        within(section).getByText("A multi-feature service."),
      ).toBeVisible();
      expect(within(section).queryByRole("link")).toBeNull();
    },
  );

  it("shows nothing but the title, the description and the link", () => {
    renderAbout();
    const section = screen.getByRole("region", {
      name: en.pages.cases.detail.aboutTitle,
    });

    expect(within(section).getAllByRole("link")).toHaveLength(1);
    expect(within(section).queryByRole("list")).toBeNull();
    expect(within(section).queryByRole("img")).toBeNull();
    expect(within(section).getAllByRole("heading")).toHaveLength(1);
  });
});

// Never reports an intersection, so sections waiting for the viewport stay paused.
class NeverIntersectingObserver {
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

const PAUSED = "[animation-play-state:paused]";

describe("CaseAbout entrance animation", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", NeverIntersectingObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("slides in once it is scrolled into view", () => {
    renderAbout();
    const reveal = screen.getByRole("region", {
      name: en.pages.cases.detail.aboutTitle,
    }).parentElement;

    expect(reveal).toHaveClass("animate-reveal-up", PAUSED);
  });
});
