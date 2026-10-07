import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageSwitcher } from "./LanguageSwitcher";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname }));

const languageSwitcher = {
  ariaLabel: "Выбор языка",
  locales: {
    en: { label: "EN", title: "English version" },
    ru: { label: "RU", title: "Русская версия" },
  },
};

beforeEach(() => {
  usePathname.mockReset();
});

describe("LanguageSwitcher", () => {
  it("is a named navigation landmark", () => {
    usePathname.mockReturnValue("/ru");
    render(
      <LanguageSwitcher
        currentLocale="ru"
        languageSwitcher={languageSwitcher}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Выбор языка" }),
    ).toBeInTheDocument();
  });

  it("links to the same page in the other locale", () => {
    usePathname.mockReturnValue("/ru/cases");
    render(
      <LanguageSwitcher
        currentLocale="ru"
        languageSwitcher={languageSwitcher}
      />,
    );

    expect(
      screen.getByRole("link", { name: "English version" }),
    ).toHaveAttribute("href", "/en/cases");
    expect(
      screen.getByRole("link", { name: "Русская версия" }),
    ).toHaveAttribute("href", "/ru/cases");
  });

  it("marks only the current locale as current", () => {
    usePathname.mockReturnValue("/en/contacts");
    render(
      <LanguageSwitcher
        currentLocale="en"
        languageSwitcher={languageSwitcher}
      />,
    );

    expect(
      screen.getByRole("link", { name: "English version" }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("link", { name: "Русская версия" }),
    ).not.toHaveAttribute("aria-current");
  });
});
