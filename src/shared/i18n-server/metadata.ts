import type { Metadata } from "next";

import {
  getLocalizedPath,
  getLocalizedPaths,
  getSiteUrl,
  type Locale,
  type PageKey,
} from "@/shared/i18n";
import { getDictionary } from "./get-dictionary";

export const createPageMetadata = async (
  page: PageKey,
  locale: Locale,
): Promise<Metadata> => {
  const dictionary = await getDictionary(locale);
  const metadata = dictionary.metadata[page];

  return {
    title: metadata.title,
    description: metadata.description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: getLocalizedPath(page, locale),
      languages: getLocalizedPaths(page),
    },
  };
};
