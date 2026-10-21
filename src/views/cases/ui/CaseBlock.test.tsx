import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

const renderCaseBlock = (locale: Locale, data: CaseListItem = caseData) =>
  render(
    <CaseBlock
      caseData={data}
      caseLabels={labelsByLocale[locale]}
      index={0}
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

    expect(screen.getByText("347 объектов")).toBeInTheDocument();
    expect(screen.queryByText(/\bobjects?\b/)).not.toBeInTheDocument();
  });

  it("shows the decorative count with the English word on /en", () => {
    renderCaseBlock("en");

    expect(screen.getByText("347 objects")).toBeInTheDocument();
  });
});
