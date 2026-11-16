import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Reveal } from "./Reveal";
import { FakeIntersectionObserver } from "./testing/FakeIntersectionObserver";

const PAUSED = "[animation-play-state:paused]";

describe("Reveal (when visible)", () => {
  beforeEach(() => {
    FakeIntersectionObserver.reset();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("holds the animation at its hidden start until the block is in view", () => {
    render(
      <Reveal delay={120} direction="left" trigger="visible">
        content
      </Reveal>,
    );
    const block = screen.getByText("content");

    expect(block).toHaveClass(
      "animate-reveal-left",
      PAUSED,
      "motion-reduce:animate-none",
      "motion-reduce:opacity-100",
    );
    expect(block.style.animationDelay).toBe("120ms");
  });

  it("plays once the block enters the viewport and does not hide it again", () => {
    render(<Reveal trigger="visible">content</Reveal>);
    const observer = FakeIntersectionObserver.latest();

    act(() => observer.trigger(true));
    expect(screen.getByText("content")).not.toHaveClass(PAUSED);

    act(() => observer.trigger(false));
    expect(screen.getByText("content")).not.toHaveClass(PAUSED);
  });

  it("plays when keyboard focus enters the block", () => {
    render(
      <Reveal trigger="visible">
        <button type="button">action</button>
      </Reveal>,
    );

    fireEvent.focus(screen.getByRole("button", { name: "action" }));

    expect(screen.getByRole("button").parentElement).not.toHaveClass(PAUSED);
  });

  it("renders a list item and keeps the parent class", () => {
    render(
      <ul>
        <Reveal as="li" className="pt-6" trigger="visible">
          item
        </Reveal>
      </ul>,
    );

    expect(screen.getByRole("listitem")).toHaveClass("pt-6", PAUSED);
  });

  it("plays at once when the browser cannot detect visibility", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal trigger="visible">content</Reveal>);

    expect(screen.getByText("content")).not.toHaveClass(PAUSED);
  });
});
