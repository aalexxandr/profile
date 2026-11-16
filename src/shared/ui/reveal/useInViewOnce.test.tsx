import { act, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FakeIntersectionObserver } from "./testing/FakeIntersectionObserver";
import { useInViewOnce } from "./useInViewOnce";

const Probe = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewOnce(ref);

  return <div data-in-view={String(isInView)} data-testid="probe" ref={ref} />;
};

const probeState = () =>
  screen.getByTestId("probe").getAttribute("data-in-view");

describe("useInViewOnce", () => {
  beforeEach(() => {
    FakeIntersectionObserver.reset();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("observes the element against the whole viewport, at its edge and at a fifth", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.latest();

    expect(observer.observed.has(screen.getByTestId("probe"))).toBe(true);
    expect(observer.options).toEqual({
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.2],
    });
  });

  it("stays false until the element enters the viewport", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.latest();

    expect(probeState()).toBe("false");

    act(() => observer.trigger(false));
    expect(probeState()).toBe("false");

    act(() => observer.trigger(true));
    expect(probeState()).toBe("true");
  });

  it("stays false while only the edge of the element is in view", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.latest();

    act(() =>
      observer.triggerPartial({
        ratio: 0.05,
        rootHeight: 800,
        visibleHeight: 20,
      }),
    );

    expect(probeState()).toBe("false");
    expect(observer.disconnected).toBe(false);
  });

  it("turns true once a fifth of the element is in view", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.latest();

    act(() =>
      observer.triggerPartial({
        ratio: 0.2,
        rootHeight: 800,
        visibleHeight: 80,
      }),
    );

    expect(probeState()).toBe("true");
    expect(observer.disconnected).toBe(true);
  });

  it("stops observing after the first hit and stays true", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.latest();

    act(() => observer.trigger(true));

    expect(observer.disconnected).toBe(true);
    expect(probeState()).toBe("true");
  });

  it("stops observing when unmounted", () => {
    const { unmount } = render(<Probe />);
    const observer = FakeIntersectionObserver.latest();

    unmount();

    expect(observer.disconnected).toBe(true);
  });

  it("is true at once when the browser cannot detect visibility", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Probe />);

    expect(probeState()).toBe("true");
  });
});
