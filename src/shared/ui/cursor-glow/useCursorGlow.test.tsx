import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GLOW_SIZE } from "./constants";
import { FINE_HOVER_QUERY, REDUCED_MOTION_QUERY } from "./mediaQueries";
import { FakeAnimationFrame } from "./testing/FakeAnimationFrame";
import { FakeMatchMedia } from "./testing/FakeMatchMedia";
import { useCursorGlow } from "./useCursorGlow";

const Probe = ({ boundaryId }: { boundaryId?: string }) => {
  const { glowRef, isEnabled, layerRef } = useCursorGlow(boundaryId);

  return isEnabled ? (
    <div data-testid="layer" ref={layerRef}>
      <div data-testid="glow" ref={glowRef} />
    </div>
  ) : null;
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

  describe("boundary", () => {
    const addBoundary = (bottom: () => number) => {
      const element = document.createElement("header");
      element.id = "boundary";
      vi.spyOn(element, "getBoundingClientRect").mockImplementation(
        () => ({ bottom: bottom() }) as DOMRect,
      );
      document.body.append(element);
    };

    it("holds the glow centre at the boundary edge", () => {
      addBoundary(() => 200);
      render(<Probe boundaryId="boundary" />);

      move(500, 50);
      act(() => frames.flush(300));

      expect(readCentre()).toEqual({ x: 500, y: 200 });
    });

    it("lets the glow reach content just below the boundary", () => {
      addBoundary(() => 200);
      render(<Probe boundaryId="boundary" />);

      move(500, 330);
      act(() => frames.flush(300));

      expect(readCentre()).toEqual({ x: 500, y: 330 });
    });

    it("lets the glow follow the pointer below the boundary", () => {
      addBoundary(() => 200);
      render(<Probe boundaryId="boundary" />);

      move(500, 780);
      act(() => frames.flush(300));

      expect(readCentre()).toEqual({ x: 500, y: 780 });
    });

    it("re-reads the boundary each frame and wakes when a container scrolls", () => {
      let bottom = 200;
      addBoundary(() => bottom);
      render(<Probe boundaryId="boundary" />);
      move(500, 50);
      act(() => frames.flush(300));

      bottom = -400;
      const scroller = document.createElement("div");
      document.body.append(scroller);
      act(() => {
        // scroll events do not bubble: the hook listens in the capture phase
        fireEvent.scroll(scroller);
      });
      act(() => frames.flush(300));

      expect(readCentre()).toEqual({ x: 500, y: 50 });
    });

    it("ignores an unknown boundary id", () => {
      render(<Probe boundaryId="missing" />);

      move(500, 50);
      act(() => frames.flush(300));

      expect(readCentre()).toEqual({ x: 500, y: 50 });
    });
  });

  describe("edge mask", () => {
    const layer = () => screen.getByTestId("layer");
    const maskWrites = (setProperty: { mock: { calls: unknown[][] } }) =>
      setProperty.mock.calls.filter(([name]) => name === "mask-image");

    const addBoundary = (bottom: () => number) => {
      const element = document.createElement("header");
      element.id = "boundary";
      vi.spyOn(element, "getBoundingClientRect").mockImplementation(
        () => ({ bottom: bottom() }) as DOMRect,
      );
      document.body.append(element);
    };

    it("cuts the layer at the boundary edge with a soft fade below it", () => {
      const setProperty = vi.spyOn(
        CSSStyleDeclaration.prototype,
        "setProperty",
      );
      addBoundary(() => 200);
      render(<Probe boundaryId="boundary" />);

      move(500, 330);
      act(() => frames.flush(5));

      expect(maskWrites(setProperty)).toContainEqual([
        "mask-image",
        "linear-gradient(to bottom, transparent 200px, #000 300px)",
      ]);
    });

    it("rewrites the mask only when the edge moves, not on every frame", () => {
      let bottom = 200;
      const setProperty = vi.spyOn(
        CSSStyleDeclaration.prototype,
        "setProperty",
      );
      addBoundary(() => bottom);
      render(<Probe boundaryId="boundary" />);
      move(500, 330);
      act(() => frames.flush(300));

      expect(maskWrites(setProperty)).toHaveLength(1);

      bottom = 120;
      act(() => {
        fireEvent.scroll(window);
      });
      act(() => frames.flush(3));

      expect(maskWrites(setProperty)).toHaveLength(2);
      expect(maskWrites(setProperty).at(-1)).toEqual([
        "mask-image",
        "linear-gradient(to bottom, transparent 120px, #000 220px)",
      ]);
    });

    it("has no mask without a boundary", () => {
      const setProperty = vi.spyOn(
        CSSStyleDeclaration.prototype,
        "setProperty",
      );
      render(<Probe />);
      move(500, 50);
      act(() => frames.flush(300));

      expect(maskWrites(setProperty)).toHaveLength(0);
      expect(layer().style.getPropertyValue("mask-image")).toBe("");
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
      expect(removeListener).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        expect.anything(),
      );
      expect(removeListener).toHaveBeenCalledWith(
        "resize",
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
