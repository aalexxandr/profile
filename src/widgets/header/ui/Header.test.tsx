import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NavigationItem } from "@/shared/i18n";

import { Header } from "./Header";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname }));

const items: NavigationItem[] = [
  { page: "home", label: "главная" },
  { page: "cases", label: "кейсы" },
  { page: "contacts", label: "контакты" },
];

const languageSwitcher = {
  ariaLabel: "Выбор языка",
  locales: {
    en: { label: "EN", title: "English version" },
    ru: { label: "RU", title: "Русская версия" },
  },
};

const renderHeader = (pathname: string) => {
  usePathname.mockReturnValue(pathname);

  render(
    <Header
      ariaLabel="Главная навигация"
      currentLocale="ru"
      items={items}
      languageSwitcher={languageSwitcher}
    />,
  );

  return within(screen.getByRole("navigation", { name: "Главная навигация" }));
};

beforeEach(() => {
  usePathname.mockReset();
});

describe("Header", () => {
  it("links every item to its localized page", () => {
    const nav = renderHeader("/ru");

    expect(nav.getByRole("link", { name: "главная" })).toHaveAttribute(
      "href",
      "/ru",
    );
    expect(nav.getByRole("link", { name: "кейсы" })).toHaveAttribute(
      "href",
      "/ru/cases",
    );
    expect(nav.getByRole("link", { name: "контакты" })).toHaveAttribute(
      "href",
      "/ru/contacts",
    );
  });

  it.each([
    ["/ru", "главная"],
    ["/ru/cases", "кейсы"],
    ["/ru/cases/product-ui", "кейсы"],
    ["/ru/contacts", "контакты"],
  ])("marks only the current page for %s", (pathname, activeLabel) => {
    const nav = renderHeader(pathname);

    for (const { label } of items) {
      const link = nav.getByRole("link", { name: label });

      if (label === activeLabel) {
        expect(link).toHaveAttribute("aria-current", "page");
      } else {
        expect(link).not.toHaveAttribute("aria-current");
      }
    }
  });

  it("marks nothing as current on an unknown page", () => {
    const nav = renderHeader("/ru/unknown");

    for (const link of nav.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });
});
