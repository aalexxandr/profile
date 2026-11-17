import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { ContactsPage } from "./ContactsPage";

vi.mock("@/shared/ui", () => ({
  CursorGlow: () => <div data-testid="cursor-glow" />,
}));

const contactsByLocale = { en: en.pages.contacts, ru: ru.pages.contacts };

describe("ContactsPage", () => {
  it.each(locales)("shows the page title in %s", (locale) => {
    render(<ContactsPage contacts={contactsByLocale[locale]} />);

    expect(screen.getByText(contactsByLocale[locale].title)).toBeVisible();
  });

  it("shows the cursor glow", () => {
    render(<ContactsPage contacts={en.pages.contacts} />);

    expect(screen.getByTestId("cursor-glow")).toBeInTheDocument();
  });
});
