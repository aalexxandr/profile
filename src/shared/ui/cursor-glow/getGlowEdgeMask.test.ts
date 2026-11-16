import { describe, expect, it } from "vitest";

import { getGlowEdgeMask } from "./getGlowEdgeMask";

describe("getGlowEdgeMask", () => {
  it("has no mask without a boundary", () => {
    expect(getGlowEdgeMask(null)).toBeNull();
  });

  it("hides everything above the edge and fades the glow in below it", () => {
    expect(getGlowEdgeMask(200)).toBe(
      "linear-gradient(to bottom, transparent 200px, #000 300px)",
    );
  });

  it("works for an edge that has scrolled above the viewport", () => {
    expect(getGlowEdgeMask(-50)).toBe(
      "linear-gradient(to bottom, transparent -50px, #000 50px)",
    );
  });

  it("rounds the edge so tiny scroll steps do not rewrite the mask", () => {
    expect(getGlowEdgeMask(200.4)).toBe(getGlowEdgeMask(200));
  });
});
