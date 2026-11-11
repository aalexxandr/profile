import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

const renderAbout = (locale: Locale = "en") =>
  render(
    <CaseAbout caseItem={caseItem} cases={dictionaries[locale].pages.cases} />,
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
