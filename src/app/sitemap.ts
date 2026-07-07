import type { MetadataRoute } from "next";

import {
  getLocalizedPath,
  getLocalizedUrls,
  getSiteUrl,
  locales,
  type PageKey,
} from "@/shared/i18n";

const pages: PageKey[] = ["home", "cases", "contacts"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const siteUrl = getSiteUrl();

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteUrl}${getLocalizedPath(page, locale)}`,
      lastModified,
      alternates: {
        languages: getLocalizedUrls(page, siteUrl),
      },
    })),
  );
}
