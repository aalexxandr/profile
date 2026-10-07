import { describe, expect, it } from "vitest";

import { formatObjectsCount } from "./formatObjectsCount";

const ruLabels = {
  few: "объекта",
  many: "объектов",
  one: "объект",
  other: "объекта",
};

const enLabels = { one: "object", other: "objects" };

describe("formatObjectsCount", () => {
  it.each([
    [1, "1 объект"],
    [2, "2 объекта"],
    [4, "4 объекта"],
    [5, "5 объектов"],
    [11, "11 объектов"],
    [21, "21 объект"],
    [22, "22 объекта"],
    [100, "100 объектов"],
  ])("uses Russian plural rules for %i", (count, expected) => {
    expect(formatObjectsCount(count, "ru", ruLabels)).toBe(expected);
  });

  it.each([
    [1, "1 object"],
    [2, "2 objects"],
    [21, "21 objects"],
  ])("uses English plural rules for %i", (count, expected) => {
    expect(formatObjectsCount(count, "en", enLabels)).toBe(expected);
  });

  it("falls back to the `other` form when a category has no label", () => {
    expect(formatObjectsCount(5, "ru", { other: "объектов" })).toBe(
      "5 объектов",
    );
  });
});
