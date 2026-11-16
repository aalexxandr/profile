import { describe, expect, it } from "vitest";

import { GLOW_LAG_MS } from "./constants";
import { getGlowStep } from "./getGlowStep";

const run = (distance: number, frameMs: number, totalMs: number) => {
  let position = 0;

  for (let elapsed = 0; elapsed < totalMs - 1e-6; elapsed += frameMs) {
    position = getGlowStep(position, distance, frameMs);
  }

  return position;
};

describe("getGlowStep", () => {
  it("lags: less than half the distance in the first 100 ms", () => {
    expect(run(1000, 1000 / 60, 100)).toBeLessThan(500);
    expect(run(1000, 1000 / 60, 100)).toBeGreaterThan(0);
  });

  it("has nearly arrived after about a second", () => {
    expect(run(1000, 1000 / 60, 1000)).toBeGreaterThan(980);
  });

  it("covers the same distance on 60 Hz and 120 Hz displays", () => {
    expect(run(1000, 1000 / 120, 500)).toBeCloseTo(
      run(1000, 1000 / 60, 500),
      0,
    );
  });

  it("moves towards the target in both directions", () => {
    expect(getGlowStep(100, 0, 16)).toBeLessThan(100);
    expect(getGlowStep(0, 100, 16)).toBeGreaterThan(0);
  });

  it("does not teleport after a stalled frame", () => {
    expect(getGlowStep(0, 1000, 60_000)).toBeCloseTo(
      getGlowStep(0, 1000, 100),
      6,
    );
    expect(getGlowStep(0, 1000, 60_000)).toBeLessThan(1000);
  });

  it("snaps to the target once it is within half a pixel", () => {
    expect(getGlowStep(99.6, 100, 16)).toBe(100);
    expect(getGlowStep(100.4, 100, 16)).toBe(100);
  });

  it("stays put when already on the target", () => {
    expect(getGlowStep(42, 42, 16)).toBe(42);
  });

  it("converges on the target and then stops changing", () => {
    let position = 0;

    for (let frame = 0; frame < 600; frame += 1) {
      position = getGlowStep(position, 640, 16);
    }

    expect(position).toBe(640);
  });

  it("uses a lag time constant that is a small trailing, not a crawl", () => {
    expect(GLOW_LAG_MS).toBeGreaterThan(100);
    expect(GLOW_LAG_MS).toBeLessThan(400);
  });
});
