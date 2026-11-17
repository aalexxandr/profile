import { describe, expect, it } from "vitest";

import { getGlowTarget } from "./getGlowTarget";

describe("getGlowTarget", () => {
  it("follows the pointer when there is no boundary", () => {
    expect(getGlowTarget({ x: 120, y: 80 }, null)).toEqual({ x: 120, y: 80 });
  });

  it("keeps the pointer when it is below the boundary edge", () => {
    expect(getGlowTarget({ x: 300, y: 900 }, 200)).toEqual({ x: 300, y: 900 });
  });

  it("lets the glow centre sit just under the edge, not further away", () => {
    expect(getGlowTarget({ x: 300, y: 260 }, 200)).toEqual({ x: 300, y: 260 });
    expect(getGlowTarget({ x: 300, y: 201 }, 200).y).toBe(201);
  });

  it("holds the centre at the boundary edge while the pointer is above it", () => {
    expect(getGlowTarget({ x: 300, y: 100 }, 200)).toEqual({ x: 300, y: 200 });
  });

  it("never changes the horizontal position", () => {
    expect(getGlowTarget({ x: -40, y: 0 }, 500).x).toBe(-40);
  });

  it("lets the glow rise again once the boundary has scrolled up", () => {
    expect(getGlowTarget({ x: 10, y: 100 }, -400)).toEqual({ x: 10, y: 100 });
  });
});
