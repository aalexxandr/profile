import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { en } from "@/shared/i18n-server/dictionaries/en";

import { CONTACT_EMAIL } from "../config";
import { ContactLinks } from "./ContactLinks";

const { links } = en.pages.contacts;

describe("ContactLinks", () => {
  it("puts the icon links on a separate row below the email", () => {
    render(<ContactLinks labels={links} />);

    const email = screen.getByRole("link", { name: CONTACT_EMAIL });
    const telegram = screen.getByRole("link", { name: links.telegram });
    const linkedin = screen.getByRole("link", { name: links.linkedin });
    const iconRow = telegram.closest("ul");

    expect(iconRow).not.toBeNull();
    expect(iconRow).toContainElement(linkedin);
    expect(iconRow).not.toContainElement(email);
    expect(
      email.compareDocumentPosition(telegram) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it.each([
    ["email", () => screen.getByRole("link", { name: CONTACT_EMAIL })],
    ["Telegram", () => screen.getByRole("link", { name: links.telegram })],
    ["LinkedIn", () => screen.getByRole("link", { name: links.linkedin })],
  ])("makes the %s link white, purple on hover and focus", (_, getLink) => {
    render(<ContactLinks labels={links} />);

    const link = getLink();

    expect(link).toHaveClass("text-white");
    expect(link).toHaveClass("hover:text-accent");
    expect(link).toHaveClass("focus-visible:text-accent");
    expect(link).not.toHaveClass("text-accent");
  });
});
