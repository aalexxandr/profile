import { render, screen } from "@testing-library/react";
import Link from "next/link";
import { describe, expect, it, vi } from "vitest";

import { ErrorScreen } from "./ErrorScreen";

vi.mock("@/shared/ui/cursor-glow", () => ({
  CursorGlow: () => <div data-testid="cursor-glow" />,
}));

const renderScreen = (variant: "notFound" | "serverError") =>
  render(
    <ErrorScreen
      description="Some things just don't exist."
      title="Nothing is here"
      variant={variant}
    >
      <Link href="/en">Back to homepage</Link>
    </ErrorScreen>,
  );

describe("ErrorScreen", () => {
  it("shows the title as the page heading, the description and the actions", () => {
    renderScreen("notFound");

    expect(
      screen.getByRole("heading", { level: 1, name: "Nothing is here" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Some things just don't exist."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to homepage" }),
    ).toHaveAttribute("href", "/en");
  });

  it.each(["notFound", "serverError"] as const)(
    "shows the cursor glow on the %s screen",
    (variant) => {
      renderScreen(variant);

      expect(screen.getByTestId("cursor-glow")).toBeInTheDocument();
    },
  );

  it.each(["notFound", "serverError"] as const)(
    "keeps the cursor glow under the %s picture",
    (variant) => {
      const { container } = renderScreen(variant);
      const glow = screen.getByTestId("cursor-glow");
      const picture = container.querySelector("img");

      // The 404 picture shares the glow's `-z-1` layer, so the earlier
      // element in the DOM is painted below.
      expect(picture).not.toBeNull();
      expect(
        glow.compareDocumentPosition(picture as Node) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    },
  );

  it("sets the title and the description in the site's pixel font", () => {
    renderScreen("serverError");

    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("font-vcr");
    expect(screen.getByText("Some things just don't exist.")).toHaveClass(
      "font-vcr",
    );
  });

  it.each([
    ["notFound", "404-bg.svg"],
    ["serverError", "500-bg.svg"],
  ] as const)(
    "draws the %s illustration as a decorative image",
    (variant, file) => {
      const { container } = renderScreen(variant);
      const image = container.querySelector("img");

      expect(image).not.toBeNull();
      expect(image).toHaveAttribute("alt", "");
      expect(image?.getAttribute("src")).toContain(file);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    },
  );
});
