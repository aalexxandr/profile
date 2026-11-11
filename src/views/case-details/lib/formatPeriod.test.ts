import { describe, expect, it } from "vitest";

import { formatPeriod } from "./formatPeriod";

describe("formatPeriod", () => {
  it.each([
    ["ru", "март 2023 – июнь 2024"],
    ["en", "March 2023 – June 2024"],
  ] as const)("joins two months and years in %s", (locale, text) => {
    expect(formatPeriod("2023-03-01", "2024-06-30", "now", locale)).toBe(text);
  });

  it.each([
    ["ru", "по настоящее время", "март 2023 – по настоящее время"],
    ["en", "present", "March 2023 – present"],
  ] as const)(
    "ends an open period with the given wording in %s",
    (locale, present, text) => {
      expect(formatPeriod("2023-03-01", null, present, locale)).toBe(text);
    },
  );

  it("drops the Russian year suffix", () => {
    expect(formatPeriod("2023-03-01", "2024-06-30", "now", "ru")).not.toContain(
      "г.",
    );
  });

  it("reads the month in UTC, not in the local time zone", () => {
    expect(formatPeriod("2023-01-01", "2023-12-31", "now", "en")).toBe(
      "January 2023 – December 2023",
    );
  });
});
