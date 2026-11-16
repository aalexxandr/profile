import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Reveal } from "./Reveal";

describe("Reveal (on mount)", () => {
  it.each([
    ["up", "animate-reveal-up"],
    ["down", "animate-reveal-down"],
    ["left", "animate-reveal-left"],
    ["right", "animate-reveal-right"],
    ["fade", "animate-reveal-fade"],
  ] as const)("animates %s with %s", (direction, className) => {
    render(<Reveal direction={direction}>content</Reveal>);

    expect(screen.getByText("content")).toHaveClass(className);
  });

  it("slides up by default", () => {
    render(<Reveal>content</Reveal>);

    expect(screen.getByText("content")).toHaveClass("animate-reveal-up");
  });

  it("delays the animation only when a delay is given", () => {
    render(
      <>
        <Reveal delay={120}>delayed</Reveal>
        <Reveal>immediate</Reveal>
      </>,
    );

    expect(screen.getByText("delayed").style.animationDelay).toBe("120ms");
    expect(screen.getByText("immediate").getAttribute("style")).toBeNull();
  });

  it("shows the content at once when the user prefers reduced motion", () => {
    render(<Reveal>content</Reveal>);

    expect(screen.getByText("content")).toHaveClass(
      "motion-reduce:animate-none",
      "motion-reduce:opacity-100",
    );
  });

  it("keeps the class given by the parent", () => {
    render(<Reveal className="absolute inset-0">content</Reveal>);

    expect(screen.getByText("content")).toHaveClass("absolute", "inset-0");
  });

  it("renders a list item when asked to", () => {
    render(
      <ul>
        <Reveal as="li">item</Reveal>
      </ul>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("item");
  });

  it("is never paused when it plays on mount", () => {
    render(<Reveal>content</Reveal>);

    expect(screen.getByText("content")).not.toHaveClass(
      "[animation-play-state:paused]",
    );
  });
});
