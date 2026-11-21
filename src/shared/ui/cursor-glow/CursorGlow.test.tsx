import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CursorGlow } from "./CursorGlow";
import { FINE_HOVER_QUERY, REDUCED_MOTION_QUERY } from "./mediaQueries";
import { FakeAnimationFrame } from "./testing/FakeAnimationFrame";
import { FakeMatchMedia } from "./testing/FakeMatchMedia";

describe("CursorGlow", () => {
  let media: FakeMatchMedia;

  beforeEach(() => {
    media = new FakeMatchMedia();
    media.install();
    media.set(FINE_HOVER_QUERY, true);
    media.set(REDUCED_MOTION_QUERY, false);
    new FakeAnimationFrame().install();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("centres a still glow in the viewport without a hovering fine pointer", () => {
    media.set(FINE_HOVER_QUERY, false);
    const { getByTestId } = render(<CursorGlow />);
    const glow = getByTestId("cursor-glow");

    expect(glow).toHaveClass("top-1/2", "left-1/2", "-translate-1/2");
    expect(glow).not.toHaveClass("opacity-0", "will-change-transform");
  });

  it("renders nothing for a mouse with reduced motion", () => {
    media.set(REDUCED_MOTION_QUERY, true);
    const { container } = render(<CursorGlow />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a decorative layer that ignores the pointer", () => {
    const { container } = render(<CursorGlow />);
    const layer = container.firstElementChild;

    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer).toHaveClass("pointer-events-none", "fixed");
    expect(container.querySelector("a, button, input, [tabindex]")).toBeNull();
  });

  it("paints the glow without any blur filter", () => {
    const { container } = render(<CursorGlow />);

    expect(container.querySelector("svg, filter")).toBeNull();
    container.querySelectorAll("*").forEach((element) => {
      expect(element.className).not.toMatch(/blur|filter/);
      expect((element as HTMLElement).style.filter).toBe("");
    });
  });

  it("does not mask any part of the layer", () => {
    const { container } = render(<CursorGlow />);
    const layer = container.firstElementChild as HTMLElement;

    expect(layer.style.getPropertyValue("mask-image")).toBe("");
    expect(layer.className).not.toMatch(/mask/);
  });
});
