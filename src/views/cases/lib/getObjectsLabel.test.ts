import { describe, expect, it } from "vitest";

import { getObjectsLabel } from "./getObjectsLabel";

const ruLabels = {
  few: "объекта",
  many: "объектов",
  one: "объект",
  other: "объекта",
};

const enLabels = { one: "object", other: "objects" };

describe("getObjectsLabel", () => {
  it.each([
    [1, "объект"],
    [2, "объекта"],
    [4, "объекта"],
    [5, "объектов"],
    [11, "объектов"],
    [21, "объект"],
    [22, "объекта"],
    [100, "объектов"],
  ])("uses Russian plural rules for %i", (count, expected) => {
    expect(getObjectsLabel(count, "ru", ruLabels)).toBe(expected);
  });

  it.each([
    [1, "object"],
    [2, "objects"],
    [21, "objects"],
  ])("uses English plural rules for %i", (count, expected) => {
    expect(getObjectsLabel(count, "en", enLabels)).toBe(expected);
  });

  it("falls back to the `other` form when a category has no label", () => {
    expect(getObjectsLabel(5, "ru", { other: "объектов" })).toBe("объектов");
  });
});
