import type { Locale } from "@/shared/i18n";

import { getMockCaseItems, type CaseFull } from "./case";
import { mockCaseDetailsByLocale } from "./case-details";

export const getMockCase = (
  locale: Locale,
  slug: string,
): CaseFull | undefined => {
  const caseItem = getMockCaseItems(locale).find((item) => item.slug === slug);
  const details = mockCaseDetailsByLocale[locale][slug];

  if (!caseItem || !details) {
    return undefined;
  }

  const { shortDesc, ...base } = caseItem;

  return { ...base, ...details, shortDescription: shortDesc };
};
