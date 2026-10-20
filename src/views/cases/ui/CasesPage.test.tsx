import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import type { CaseListItem } from "../api/types";
import { CasesPage } from "./CasesPage";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const labelsByLocale = { en: en.pages.cases, ru: ru.pages.cases };

const item = (slug: string, name: string): CaseListItem => ({
  blurImage: null,
  category: "Web App",
  image: null,
  locale: "en",
  name,
  shortDescription: `${name} description`,
  slug,
  stack: [],
});

describe("CasesPage", () => {
  it.each(locales)("shows one block per case in order in %s", (locale) => {
    render(
      <CasesPage
        caseItems={[item("spectre", "Spectre"), item("orbit", "Orbit")]}
        cases={labelsByLocale[locale]}
        locale={locale}
      />,
    );

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["Spectre", "Orbit"]);
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("renders only the title when the list is empty", () => {
    render(<CasesPage caseItems={[]} cases={en.pages.cases} locale="en" />);

    expect(
      screen.getByRole("heading", { level: 1, name: en.pages.cases.title }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
