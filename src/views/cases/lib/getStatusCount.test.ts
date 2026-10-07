import { describe, expect, it } from "vitest";

import { getMockCaseItems } from "../model/case";
import { getStatusCount } from "./getStatusCount";

describe("getStatusCount", () => {
  it("returns the same value for the same slug", () => {
    expect(getStatusCount("product-ui")).toBe(getStatusCount("product-ui"));
  });

  it("stays inside the [2, 1000] range for a wide set of slugs", () => {
    const slugs = [
      "",
      "a",
      "product-ui",
      "booking-flow",
      "fintech-console",
      "очень-длинный-slug-".repeat(50),
      ...Array.from({ length: 2000 }, (_, index) => `case-${index}`),
    ];

    for (const slug of slugs) {
      const count = getStatusCount(slug);

      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(1000);
      expect(Number.isInteger(count)).toBe(true);
    }
  });

  it("returns the minimum for an empty slug", () => {
    expect(getStatusCount("")).toBe(2);
  });

  it("gives different values to the mock case slugs", () => {
    const counts = getMockCaseItems("en").map(({ slug }) =>
      getStatusCount(slug),
    );

    expect(new Set(counts).size).toBe(counts.length);
  });
});
