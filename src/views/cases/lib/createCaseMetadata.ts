import type { Metadata } from "next";

import {
  defaultLocale,
  getLocalizedPath,
  getSiteUrl,
  locales,
  type Locale,
} from "@/shared/i18n";

import type { CaseFull } from "../model/case";

const getCasePath = (locale: Locale, slug: CaseFull["slug"]) =>
  `${getLocalizedPath("cases", locale)}/${slug}`;

export const createCaseMetadata = (
  caseItem: CaseFull,
  locale: Locale,
): Metadata => ({
  title: caseItem.name,
  description: caseItem.shortDescription,
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: getCasePath(locale, caseItem.slug),
    languages: {
      ...Object.fromEntries(
        locales.map((item) => [item, getCasePath(item, caseItem.slug)]),
      ),
      "x-default": getCasePath(defaultLocale, caseItem.slug),
    },
  },
});
