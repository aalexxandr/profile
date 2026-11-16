import { describe, expect, it } from "vitest";

import { getStaggerDelay } from "./getStaggerDelay";

describe("getStaggerDelay", () => {
  it.each([
    [0, 120],
    [1, 200],
    [2, 280],
    [5, 520],
    [6, 600],
  ])("delays item %i by %i ms", (index, delay) => {
    expect(getStaggerDelay(index)).toBe(delay);
  });

  it("never waits longer than 600 ms, however long the list is", () => {
    expect(getStaggerDelay(7)).toBe(600);
    expect(getStaggerDelay(40)).toBe(600);
  });
});
