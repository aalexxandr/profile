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

  it("renders nothing without a hovering fine pointer", () => {
    media.set(FINE_HOVER_QUERY, false);
    const { container } = render(<CursorGlow />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for reduced motion", () => {
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
