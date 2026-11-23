import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { NotFoundPage } from "./NotFoundPage";

const { useParams } = vi.hoisted(() => ({ useParams: vi.fn() }));

vi.mock("next/navigation", () => ({ useParams }));

const textsByLocale = { ru: ru.errors.notFound, en: en.errors.notFound };

beforeEach(() => {
  useParams.mockReset();
});

describe.each<Locale>(["ru", "en"])("NotFoundPage in %s", (locale) => {
  const texts = textsByLocale[locale];

  const renderPage = () => {
    useParams.mockReturnValue({ locale });
    render(<NotFoundPage textsByLocale={textsByLocale} />);
  };

  it("shows the title and description of the route's locale", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: texts.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(texts.description)).toBeInTheDocument();
  });

  it("sets the localized document title", () => {
    renderPage();

    expect(document.title).toBe(texts.metaTitle);
  });

  it("links back to the home page of its locale", () => {
    renderPage();

    expect(screen.getByRole("link", { name: texts.home })).toHaveAttribute(
      "href",
      `/${locale}`,
    );
  });
});
