import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { CaseStack } from "./CaseStack";

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const renderStack = (stack: string[], locale: Locale = "en") =>
  render(<CaseStack cases={dictionaries[locale].pages.cases} stack={stack} />);

describe("CaseStack", () => {
  it.each(locales)("is titled in %s", (locale) => {
    renderStack(["React", "TypeScript"], locale);
    const { stackTitle } = dictionaries[locale].pages.cases.detail;
    const section = screen.getByRole("region", { name: stackTitle });

    expect(
      within(section).getByRole("heading", { level: 2, name: stackTitle }),
    ).toBeInTheDocument();
  });

  it("lists every technology in the backend order", () => {
    renderStack(["TypeScript", "React", "Next.js"]);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");

    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("TypeScript"),
      expect.stringContaining("React"),
      expect.stringContaining("Next.js"),
    ]);
  });

  it("frames the card with the code border image", () => {
    renderStack(["React"]);

    expect(screen.getByRole("list").className).toContain("/code-border.png");
  });

  it("sets the frame width and outset in one border-image shorthand", () => {
    renderStack(["React"]);
    const { className } = screen.getByRole("list");

    // 30px strips = the 25px border plus the 5px outset, so they meet the card.
    expect(className).toContain("_25/30px/5px]");
    expect(className).toContain("_25/14px/2px]");
    expect(className).not.toContain("border-image-outset");
    // The narrow frame must match the narrow border, the wide one only from sm.
    expect(className).toContain(
      "sm:[border-image:url('/code-border.png')_25/30px/5px]",
    );
    expect(className.split(" ")).toEqual(
      expect.arrayContaining(["border-12", "sm:border-25"]),
    );
    expect(className.split(" ")).not.toContain("border-25");
  });

  it("keeps the white fill inside the card, not under the frame", () => {
    renderStack(["React"]);

    expect(screen.getByRole("list")).toHaveClass("bg-clip-padding");
  });
});
