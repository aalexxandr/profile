import { describe, expect, it } from "vitest";

import type { Dictionary } from "@/shared/i18n";

import { formatTeamSize } from "./formatTeamSize";

type TeamSizeUnit = Dictionary["pages"]["cases"]["detail"]["teamSizeUnit"];

const ruUnit: TeamSizeUnit = {
  few: "человека",
  many: "человек",
  one: "человек",
  other: "человека",
};
const enUnit: TeamSizeUnit = { one: "person", other: "people" };

describe("formatTeamSize", () => {
  it.each([
    [0, "0 человек"],
    [1, "1 человек"],
    [2, "2 человека"],
    [4, "4 человека"],
    [5, "5 человек"],
    [11, "11 человек"],
    [21, "21 человек"],
    [22, "22 человека"],
    [25, "25 человек"],
  ])("writes %i in Russian as %s", (teamSize, text) => {
    expect(formatTeamSize(teamSize, ruUnit, "ru")).toBe(text);
  });

  it.each([
    [1, "1 person"],
    [2, "2 people"],
    [21, "21 people"],
  ])("writes %i in English as %s", (teamSize, text) => {
    expect(formatTeamSize(teamSize, enUnit, "en")).toBe(text);
  });

  it("falls back to the other form when a plural form is missing", () => {
    expect(formatTeamSize(2, { other: "чел." }, "ru")).toBe("2 чел.");
  });
});
