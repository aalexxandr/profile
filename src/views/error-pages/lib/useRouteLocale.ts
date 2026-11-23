"use client";

import { useParams } from "next/navigation";

import { defaultLocale, isLocale, type Locale } from "@/shared/i18n";

// The locale of the current `[locale]` route. The proxy puts every address
// under a locale, so the fallback only guards an unexpected route.
export const useRouteLocale = (): Locale => {
  const locale = useParams<{ locale?: string }>()?.locale;

  return locale && isLocale(locale) ? locale : defaultLocale;
};
