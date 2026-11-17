import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { en } from "@/shared/i18n-server/dictionaries/en";

import { ContactsInfo } from "./ContactsInfo";

describe("ContactsInfo", () => {
  it("keeps the line breaks of the dictionary text", () => {
    const contacts = {
      ...en.pages.contacts,
      infoText: "First line\nSecond line",
    };

    render(<ContactsInfo contacts={contacts} />);

    const paragraph = screen.getByText(/First line/);

    expect(paragraph.textContent).toBe("First line\nSecond line");
    expect(paragraph).toHaveClass("whitespace-pre-line");
  });
});
