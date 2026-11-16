import { describe, expect, it } from "vitest";

import { hasProjectLink } from "./hasProjectLink";

describe("hasProjectLink", () => {
  it.each([undefined, null, "", "   "])("is false for %j", (href) => {
    expect(hasProjectLink(href)).toBe(false);
  });

  it("is true for a url", () => {
    expect(hasProjectLink("https://example.com")).toBe(true);
  });
});
