import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import type { CaseListItem } from "../api/types";
import { CasesPage } from "./CasesPage";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("@/shared/ui", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  CursorGlow: ({ boundaryId }: { boundaryId?: string }) => (
    <div data-boundary={boundaryId} data-testid="cursor-glow" />
  ),
}));

const labelsByLocale = { en: en.pages.cases, ru: ru.pages.cases };

const item = (slug: string, name: string): CaseListItem => ({
  blurImage: null,
  category: "Web App",
  image: null,
  locale: "en",
  name,
  projectLink: `https://example.com/${slug}`,
  shortDescription: `${name} description`,
  slug,
  stack: [],
});

describe("CasesPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("plays the first block on load and holds the others until they are in view", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        disconnect() {}
        observe() {}
        takeRecords() {
          return [];
        }
        unobserve() {}
      },
    );
    render(
      <CasesPage
        caseItems={[item("spectre", "Spectre"), item("orbit", "Orbit")]}
        cases={en.pages.cases}
        locale="en"
      />,
    );
    const [first, second] = screen
      .getAllByRole("region")
      .map((region) => region.parentElement?.parentElement?.parentElement);

    expect(first).not.toHaveClass("[animation-play-state:paused]");
    expect(second).toHaveClass("[animation-play-state:paused]");
  });

  it("renders only the title when the list is empty", () => {
    render(<CasesPage caseItems={[]} cases={en.pages.cases} locale="en" />);

    expect(
      screen.getByRole("heading", { level: 1, name: en.pages.cases.title }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});

describe("CasesPage cursor glow", () => {
  it.each(locales)("shows the cursor glow in %s", (locale) => {
    render(
      <CasesPage
        caseItems={[item("spectre", "Spectre")]}
        cases={labelsByLocale[locale]}
        locale={locale}
      />,
    );

    expect(screen.getByTestId("cursor-glow")).toBeInTheDocument();
  });

  it("has no boundary: the glow may cover the whole list", () => {
    render(<CasesPage cases={en.pages.cases} locale="en" />);

    expect(screen.getByTestId("cursor-glow")).not.toHaveAttribute(
      "data-boundary",
    );
  });
});
