import { describe, expect, it } from "vitest";

import { isFarEnoughInView } from "./isFarEnoughInView";

type EntryInput = {
  isIntersecting?: boolean;
  ratio: number;
  rootHeight: number | null;
  visibleHeight: number;
};

const entry = ({
  isIntersecting = true,
  ratio,
  rootHeight,
  visibleHeight,
}: EntryInput) => ({
  intersectionRatio: ratio,
  intersectionRect: { height: visibleHeight } as DOMRectReadOnly,
  isIntersecting,
  rootBounds:
    rootHeight === null ? null : ({ height: rootHeight } as DOMRectReadOnly),
});

describe("isFarEnoughInView", () => {
  it("is false while only the edge of a block is in view", () => {
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.1, rootHeight: 800, visibleHeight: 40 }),
      ),
    ).toBe(false);
  });

  it("is true once a fifth of the block is in view", () => {
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.2, rootHeight: 800, visibleHeight: 80 }),
      ),
    ).toBe(true);
  });

  it("is false just below a fifth", () => {
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.19, rootHeight: 800, visibleHeight: 76 }),
      ),
    ).toBe(false);
  });

  it("is true for a tall block once it fills a quarter of the viewport", () => {
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.08, rootHeight: 800, visibleHeight: 200 }),
      ),
    ).toBe(true);
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.07, rootHeight: 800, visibleHeight: 199 }),
      ),
    ).toBe(false);
  });

  it("falls back to the ratio when the viewport size is unknown", () => {
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.1, rootHeight: null, visibleHeight: 500 }),
      ),
    ).toBe(false);
    expect(
      isFarEnoughInView(
        entry({ ratio: 0.5, rootHeight: null, visibleHeight: 50 }),
      ),
    ).toBe(true);
  });

  it("is false when the block is not intersecting", () => {
    expect(
      isFarEnoughInView(
        entry({
          isIntersecting: false,
          ratio: 0,
          rootHeight: 800,
          visibleHeight: 0,
        }),
      ),
    ).toBe(false);
  });
});
