import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CaseBackLink } from "./CaseBackLink";

describe("CaseBackLink", () => {
  it.each([
    ["/en/cases", "Back to cases"],
    ["/ru/cases", "Назад к кейсам"],
  ])("links to %s with the text %s", (href, text) => {
    render(<CaseBackLink href={href}>{text}</CaseBackLink>);

    expect(screen.getByRole("link", { name: text })).toHaveAttribute(
      "href",
      href,
    );
  });

  it("has a decorative arrow that is not part of the name", () => {
    const { container } = render(
      <CaseBackLink href="/en/cases">Back to cases</CaseBackLink>,
    );
    const arrow = container.querySelector("svg");

    expect(arrow).toHaveAttribute("aria-hidden", "true");
    expect(arrow).toHaveAttribute("focusable", "false");
    expect(screen.getByRole("link")).toHaveAccessibleName("Back to cases");
  });

  it("uses the accent colour with hover and focus states", () => {
    render(<CaseBackLink href="/en/cases">Back to cases</CaseBackLink>);

    expect(screen.getByRole("link")).toHaveClass(
      "text-accent",
      "hover:text-white",
      "focus-visible:text-focus-ring",
    );
  });
});
