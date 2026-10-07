import type { MetadataRoute } from "next";

import { getMockCaseItems } from "@/views/cases";
import {
  defaultLocale,
  getLocalizedPath,
  getLocalizedUrls,
  getSiteUrl,
  locales,
  type Locale,
  type PageKey,
} from "@/shared/i18n";

const pages: PageKey[] = ["home", "cases", "contacts"];

const caseSlugs = getMockCaseItems(defaultLocale).map(({ slug }) => slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const siteUrl = getSiteUrl();
  const pageEntries = pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteUrl}${getLocalizedPath(page, locale)}`,
      lastModified,
      alternates: {
        languages: getLocalizedUrls(page, siteUrl),
      },
    })),
  );
  const caseEntries = caseSlugs.flatMap((slug) => {
    const getUrl = (locale: Locale) =>
      `${siteUrl}${getLocalizedPath("cases", locale)}/${slug}`;

    return locales.map((locale) => ({
      url: getUrl(locale),
      lastModified,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((item) => [item, getUrl(item)])),
          "x-default": getUrl(defaultLocale),
        },
      },
    }));
  });

  return [...pageEntries, ...caseEntries];
}
