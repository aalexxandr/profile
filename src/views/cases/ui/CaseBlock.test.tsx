import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import type { CaseListItem } from "../api/types";
import { CaseBlock } from "./CaseBlock";

type MockImageProps = { alt: string; blurDataURL?: string; src: string };

vi.mock("next/image", () => ({
  default: ({ alt, blurDataURL, src }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} data-blur={blurDataURL} src={src} />
  ),
}));

const caseData: CaseListItem = {
  blurImage: "data:image/png;base64,AAAA",
  category: "FinTech / Web App",
  image: "https://cdn.test/spectre.webp",
  locale: "en",
  name: "Spectre Explorer",
  projectLink: "https://example.com/spectre",
  shortDescription: "Short description",
  slug: "spectre",
  stack: ["React"],
};

const labelsByLocale = { en: en.pages.cases, ru: ru.pages.cases };

const renderCaseBlock = (
  locale: Locale,
  data: CaseListItem = caseData,
  index = 0,
) =>
  render(
    <CaseBlock
      caseData={data}
      caseLabels={labelsByLocale[locale]}
      index={index}
      locale={locale}
    />,
  );

describe("CaseBlock", () => {
  it("shows the name and short description", () => {
    renderCaseBlock("en");

    expect(
      screen.getByRole("heading", { name: "Spectre Explorer" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
  });

  it("shows the whole short description without cutting it", () => {
    renderCaseBlock("en");
    const description = screen.getByText("Short description");
    const clampClasses = [...description.classList].filter(
      (name) => name.includes("line-clamp") || name.includes("truncate"),
    );

    expect(clampClasses).toEqual([]);
  });

  it("lets the window content grow with the description", () => {
    renderCaseBlock("en");
    const content = screen.getByText("Short description").parentElement;
    const heightClasses = [...(content?.classList ?? [])].filter((name) =>
      /(^|:)h-/.test(name),
    );

    expect(heightClasses).toEqual([]);
  });

  it.each(locales)("links to the case page in %s", (locale) => {
    renderCaseBlock(locale);

    expect(
      screen.getByRole("link", {
        name: `${labelsByLocale[locale].actions.moreInformation}: Spectre Explorer`,
      }),
    ).toHaveAttribute("href", `/${locale}/cases/spectre`);
  });

  it.each(locales)(
    "opens the project in a new tab with a descriptive name in %s",
    (locale) => {
      renderCaseBlock(locale);
      const link = screen.getByRole("link", {
        name: `${labelsByLocale[locale].actions.projectLink}: Spectre Explorer`,
      });

      expect(link).toHaveAttribute("href", "https://example.com/spectre");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    },
  );

  it.each(locales)(
    "shows the private project label instead of a project link in %s",
    (locale) => {
      renderCaseBlock(locale, { ...caseData, projectLink: null });

      expect(
        screen.getByText(labelsByLocale[locale].actions.projectPrivate),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("link", {
          name: `${labelsByLocale[locale].actions.projectLink}: Spectre Explorer`,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: `${labelsByLocale[locale].actions.moreInformation}: Spectre Explorer`,
        }),
      ).toHaveAttribute("href", `/${locale}/cases/spectre`);
    },
  );

  it("shows the picture with its blur preview", () => {
    renderCaseBlock("en");
    const image = screen.getByRole("img", { name: "Spectre Explorer" });

    expect(image).toHaveAttribute("src", "https://cdn.test/spectre.webp");
    expect(image).toHaveAttribute("data-blur", "data:image/png;base64,AAAA");
  });

  it.each(locales)("shows the no-image text in %s", (locale) => {
    renderCaseBlock(locale, { ...caseData, blurImage: null, image: null });

    expect(
      screen.getByText(labelsByLocale[locale].noImage),
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("CaseBlock status counter", () => {
  it("shows the decorative count with the Russian word on /ru", () => {
    renderCaseBlock("ru");

    expect(screen.getByText(/^\d{3} объектов$/)).toBeInTheDocument();
    expect(screen.queryByText(/\bobjects?\b/)).not.toBeInTheDocument();
  });

  it("shows the decorative count with the English word on /en", () => {
    renderCaseBlock("en");

    expect(screen.getByText(/^\d{3} objects$/)).toBeInTheDocument();
  });
});

// Never reports an intersection, so blocks waiting for the viewport stay paused.
class NeverIntersectingObserver {
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

const PAUSED = "[animation-play-state:paused]";

const pictureReveal = () =>
  screen.getByRole("img", { name: "Spectre Explorer" }).parentElement;
const windowReveal = () =>
  screen.getByRole("region", { name: "Spectre Explorer" }).parentElement;

describe("CaseBlock entrance animation", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", NeverIntersectingObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("slides the picture and the window in from opposite sides in an even block", () => {
    renderCaseBlock("en", caseData, 0);

    expect(pictureReveal()).toHaveClass("animate-reveal-left");
    expect(windowReveal()).toHaveClass("animate-reveal-right");
    expect(pictureReveal()?.style.animationDelay).toBe("");
    expect(windowReveal()?.style.animationDelay).toBe("120ms");
  });

  it("swaps the sides in an odd block", () => {
    renderCaseBlock("en", caseData, 1);

    expect(pictureReveal()).toHaveClass("animate-reveal-right");
    expect(windowReveal()).toHaveClass("animate-reveal-left");
  });

  it("plays the first block on load", () => {
    renderCaseBlock("en", caseData, 0);

    expect(pictureReveal()).not.toHaveClass(PAUSED);
    expect(windowReveal()).not.toHaveClass(PAUSED);
  });

  it("waits for the viewport in later blocks", () => {
    renderCaseBlock("en", caseData, 2);

    expect(pictureReveal()).toHaveClass(PAUSED);
    expect(windowReveal()).toHaveClass(PAUSED);
  });

  it("animates the no-image box like the picture", () => {
    renderCaseBlock("en", { ...caseData, blurImage: null, image: null }, 0);

    expect(screen.getByText(en.pages.cases.noImage).parentElement).toHaveClass(
      "animate-reveal-left",
    );
  });
});
