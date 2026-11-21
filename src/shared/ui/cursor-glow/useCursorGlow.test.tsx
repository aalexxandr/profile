import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GLOW_SIZE } from "./constants";
import { FINE_HOVER_QUERY, REDUCED_MOTION_QUERY } from "./mediaQueries";
import { FakeAnimationFrame } from "./testing/FakeAnimationFrame";
import { FakeMatchMedia } from "./testing/FakeMatchMedia";
import { useCursorGlow } from "./useCursorGlow";

const Probe = () => {
  const { glowRef, isEnabled } = useCursorGlow();

  return isEnabled ? <div data-testid="glow" ref={glowRef} /> : null;
};

const glow = () => screen.getByTestId("glow");

// Centre of the glow in viewport px, read back from its transform.
const readCentre = () => {
  const match = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px, 0\)/.exec(
    glow().style.transform,
  );

  if (!match) {
    throw new Error(`no translate3d in "${glow().style.transform}"`);
  }

  return {
    x: Number(match[1]) + GLOW_SIZE / 2,
    y: Number(match[2]) + GLOW_SIZE / 2,
  };
};

const move = (x: number, y: number) =>
  act(() => {
    fireEvent.mouseMove(window, { clientX: x, clientY: y });
  });

describe("useCursorGlow", () => {
  let media: FakeMatchMedia;
  let frames: FakeAnimationFrame;

  beforeEach(() => {
    media = new FakeMatchMedia();
    media.install();
    media.set(FINE_HOVER_QUERY, true);
    media.set(REDUCED_MOTION_QUERY, false);
    frames = new FakeAnimationFrame();
    frames.install();
    vi.stubGlobal("innerWidth", 1000);
    vi.stubGlobal("innerHeight", 800);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  describe("gating", () => {
    it("is enabled for a hovering fine pointer", () => {
      render(<Probe />);

      expect(screen.getByTestId("glow")).toBeInTheDocument();
    });

    it.each([
      ["a coarse pointer or no hover", FINE_HOVER_QUERY, false],
      ["reduced motion", REDUCED_MOTION_QUERY, true],
    ])("renders nothing and runs nothing for %s", (_name, query, value) => {
      media.set(query, value);
      const addListener = vi.spyOn(window, "addEventListener");

      render(<Probe />);

      expect(screen.queryByTestId("glow")).not.toBeInTheDocument();
      expect(frames.pending).toBe(0);
      expect(addListener).not.toHaveBeenCalledWith(
        "mousemove",
        expect.anything(),
        expect.anything(),
      );
    });

    it("removes the glow when reduced motion is switched on while open", () => {
      render(<Probe />);

      act(() => media.set(REDUCED_MOTION_QUERY, true));

      expect(screen.queryByTestId("glow")).not.toBeInTheDocument();
      expect(frames.pending).toBe(0);
    });

    it("shows the glow when the pointer becomes a hovering one", () => {
      media.set(FINE_HOVER_QUERY, false);
      render(<Probe />);

      act(() => media.set(FINE_HOVER_QUERY, true));

      expect(screen.getByTestId("glow")).toBeInTheDocument();
    });
  });

  describe("following the pointer", () => {
    it("starts at the viewport centre and fades in on the first frame", () => {
      render(<Probe />);

      expect(glow().style.opacity).toBe("");

      act(() => frames.flush());

      expect(readCentre()).toEqual({ x: 500, y: 400 });
      expect(glow().style.opacity).toBe("1");
    });

    it("moves towards the pointer without jumping, then settles on it", () => {
      render(<Probe />);
      act(() => frames.flush());

      move(900, 100);
      act(() => frames.flush());
      const { x, y } = readCentre();

      expect(x).toBeGreaterThan(500);
      expect(x).toBeLessThan(900);
      expect(y).toBeLessThan(400);
      expect(y).toBeGreaterThan(100);

      act(() => frames.flush(200));

      expect(readCentre()).toEqual({ x: 900, y: 100 });
    });

    it("positions the glow with transform only", () => {
      render(<Probe />);
      move(10, 10);
      act(() => frames.flush());

      expect(glow().style.getPropertyValue("--x")).toBe("");
      expect(glow().style.top).toBe("");
      expect(glow().style.left).toBe("");
    });

    it("stops requesting frames once settled and wakes on the next move", () => {
      render(<Probe />);
      act(() => frames.flush(200));

      expect(frames.pending).toBe(0);

      move(300, 300);

      expect(frames.pending).toBe(1);
    });
  });

  describe("anywhere on the page", () => {
    it("reaches a pointer at the very top of the viewport", () => {
      render(<Probe />);

      move(500, 10);
      act(() => frames.flush(300));

      expect(readCentre()).toEqual({ x: 500, y: 10 });
    });

    it("never masks any part of the glow", () => {
      const setProperty = vi.spyOn(
        CSSStyleDeclaration.prototype,
        "setProperty",
      );
      render(<Probe />);

      move(500, 10);
      act(() => frames.flush(300));

      expect(
        setProperty.mock.calls.filter(([name]) => name === "mask-image"),
      ).toEqual([]);
    });

    it("does not wake on scroll or resize once settled", () => {
      render(<Probe />);
      move(500, 300);
      act(() => frames.flush(300));

      expect(frames.pending).toBe(0);

      const scroller = document.createElement("div");
      document.body.append(scroller);
      act(() => {
        fireEvent.scroll(scroller);
        fireEvent.scroll(window);
        fireEvent(window, new Event("resize"));
      });

      expect(frames.pending).toBe(0);
    });
  });

  describe("time-based lag", () => {
    it("covers the same distance on 60 Hz and 120 Hz displays", () => {
      const travelled = (frameMs: number) => {
        const { unmount } = render(<Probe />);
        act(() => frames.flush(1, frameMs));
        move(900, 400);
        act(() => frames.flush(Math.round(300 / frameMs), frameMs));
        const { x } = readCentre();
        unmount();

        return x;
      };

      // A 400 px jump; the first frame after waking counts as 16.7 ms at any
      // rate, so allow a 1.5% difference.
      expect(
        Math.abs(travelled(1000 / 120) - travelled(1000 / 60)),
      ).toBeLessThan(6);
    });

    it("trails the pointer: little progress in the first 50 ms", () => {
      render(<Probe />);
      act(() => frames.flush());
      move(900, 400);
      act(() => frames.flush(3));

      expect(readCentre().x).toBeGreaterThan(500);
      expect(readCentre().x).toBeLessThan(500 + (900 - 500) * 0.35);
    });
  });

  describe("teardown", () => {
    it("removes its listeners and cancels the pending frame on unmount", () => {
      const removeListener = vi.spyOn(window, "removeEventListener");
      const { unmount } = render(<Probe />);
      move(10, 10);

      expect(frames.pending).toBe(1);

      unmount();

      expect(frames.pending).toBe(0);
      expect(removeListener).toHaveBeenCalledWith(
        "mousemove",
        expect.any(Function),
      );
    });

    it("stops listening for preference changes on unmount", () => {
      const { unmount } = render(<Probe />);

      expect(media.listenerCount()).toBeGreaterThan(0);

      unmount();

      expect(media.listenerCount()).toBe(0);
    });
  });
});
