import { beforeAll, describe, expect, it } from "vitest";

import type { Dictionary, Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n-server";

import type { CaseDetail } from "../api/types";
import { getCaseFacts } from "./getCaseFacts";

type Detail = Dictionary["pages"]["cases"]["detail"];

const caseItem: Pick<
  CaseDetail,
  "company" | "endedAt" | "role" | "startedAt" | "teamSize"
> = {
  company: "Spectre Labs",
  endedAt: "2024-06-30",
  role: "FRONTEND",
  startedAt: "2023-03-01",
  teamSize: 6,
};

const details = {} as Record<Locale, Detail>;

beforeAll(async () => {
  for (const locale of ["en", "ru"] as const) {
    details[locale] = (await getDictionary(locale)).pages.cases.detail;
  }
});

describe("getCaseFacts", () => {
  it("lists the role, period, company and team in that order", () => {
    const facts = getCaseFacts(caseItem, details.en, "en");

    expect(facts.map(({ id }) => id)).toEqual([
      "role",
      "period",
      "company",
      "team",
    ]);
  });

  it("uses the labels of the dictionary of the locale", () => {
    const facts = getCaseFacts(caseItem, details.ru, "ru");

    expect(facts.map(({ label }) => label)).toEqual([
      details.ru.roleLabel,
      details.ru.periodLabel,
      details.ru.companyLabel,
      details.ru.teamSizeLabel,
    ]);
  });

  it.each([
    [
      "en",
      [
        "Frontend developer",
        "March 2023 – June 2024",
        "Spectre Labs",
        "6 people",
      ],
    ],
    [
      "ru",
      [
        "Frontend-разработчик",
        "март 2023 – июнь 2024",
        "Spectre Labs",
        "6 человек",
      ],
    ],
  ] as const)("formats the values in %s", (locale, values) => {
    const facts = getCaseFacts(caseItem, details[locale], locale);

    expect(facts.map(({ value }) => value)).toEqual(values);
  });

  it("reads an open period with the present wording", () => {
    const [, period] = getCaseFacts(
      { ...caseItem, endedAt: null },
      details.en,
      "en",
    );

    expect(period?.value).toBe("March 2023 – present");
  });

  it("has no company fact without a company", () => {
    const facts = getCaseFacts(
      { ...caseItem, company: null },
      details.en,
      "en",
    );

    expect(facts.map(({ id }) => id)).toEqual(["role", "period", "team"]);
  });

  it("has no team fact without a team size, but keeps a team of zero", () => {
    const without = getCaseFacts(
      { ...caseItem, teamSize: null },
      details.en,
      "en",
    );
    const zero = getCaseFacts({ ...caseItem, teamSize: 0 }, details.en, "en");

    expect(without.map(({ id }) => id)).toEqual(["role", "period", "company"]);
    expect(zero.at(-1)?.value).toBe("0 people");
  });

  it("keeps only the role and the period when both optional facts are missing", () => {
    const facts = getCaseFacts(
      { ...caseItem, company: null, teamSize: null },
      details.en,
      "en",
    );

    expect(facts.map(({ id }) => id)).toEqual(["role", "period"]);
  });
});
