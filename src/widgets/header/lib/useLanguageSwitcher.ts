import { useCallback } from "react";
import { usePathname } from "next/navigation";

import type { Locale } from "@/shared/i18n";

const getLanguageHref = (pathname: string, locale: Locale) => {
  const segments = pathname.split("/");
  segments[1] = locale;

  return segments.join("/") || `/${locale}`;
};

export const useLanguageSwitcher = () => {
  const pathname = usePathname();

  const getLocaleHref = useCallback(
    (locale: Locale) => getLanguageHref(pathname, locale),
    [pathname],
  );

  return {
    getLocaleHref,
  };
};
