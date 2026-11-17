import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import {
  CONTACT_EMAIL,
  CONTACT_LINKEDIN_URL,
  CONTACT_TELEGRAM_URL,
} from "../config";
import { ContactsPage } from "./ContactsPage";

vi.mock("@/shared/ui/cursor-glow", () => ({
  CursorGlow: () => <div data-testid="cursor-glow" />,
}));

const contactsByLocale = { en: en.pages.contacts, ru: ru.pages.contacts };

describe("ContactsPage", () => {
  it.each(locales)("shows the page title in %s", (locale) => {
    render(<ContactsPage contacts={contactsByLocale[locale]} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: contactsByLocale[locale].title,
      }),
    ).toBeVisible();
  });

  it("shows the cursor glow", () => {
    render(<ContactsPage contacts={en.pages.contacts} />);

    expect(screen.getByTestId("cursor-glow")).toBeInTheDocument();
  });

  describe.each(locales)("contact links in %s", (locale) => {
    const contacts = contactsByLocale[locale];

    it("links to the email, Telegram and LinkedIn", () => {
      render(<ContactsPage contacts={contacts} />);

      expect(screen.getByRole("link", { name: CONTACT_EMAIL })).toHaveAttribute(
        "href",
        `mailto:${CONTACT_EMAIL}`,
      );
      expect(
        screen.getByRole("link", { name: contacts.links.telegram }),
      ).toHaveAttribute("href", CONTACT_TELEGRAM_URL);
      expect(
        screen.getByRole("link", { name: contacts.links.linkedin }),
      ).toHaveAttribute("href", CONTACT_LINKEDIN_URL);
    });

    it("opens the social links in a new tab safely", () => {
      render(<ContactsPage contacts={contacts} />);

      for (const name of [contacts.links.telegram, contacts.links.linkedin]) {
        const link = screen.getByRole("link", { name });

        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });

  it("has no phone, WhatsApp or X links", () => {
    render(<ContactsPage contacts={en.pages.contacts} />);

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "");

    expect(hrefs.some((href) => href.startsWith("tel:"))).toBe(false);
    expect(
      hrefs.some((href) => /wa\.me|whatsapp|x\.com|twitter/.test(href)),
    ).toBe(false);
  });

  it.each(locales)(
    "shows the info text and the illustration in %s",
    (locale) => {
      const contacts = contactsByLocale[locale];

      render(<ContactsPage contacts={contacts} />);

      expect(
        screen.getByText(contacts.infoText.replace(/\s+/g, " ").trim()),
      ).toBeVisible();
      expect(
        screen.getByRole("img", { name: contacts.illustrationAlt }),
      ).toBeInTheDocument();
    },
  );

  it.each(locales)("shows the form in %s", (locale) => {
    const { form } = contactsByLocale[locale];

    render(<ContactsPage contacts={contactsByLocale[locale]} />);

    const formRegion = screen.getByRole("form", { name: form.title });

    expect(
      within(formRegion).getByLabelText(new RegExp(form.nameLabel)),
    ).toBeVisible();
    expect(
      within(formRegion).getByRole("button", { name: form.send }),
    ).toBeVisible();
  });

  it("has no service selector", () => {
    render(<ContactsPage contacts={en.pages.contacts} />);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
