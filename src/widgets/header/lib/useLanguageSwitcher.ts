import { useCallback } from "react";
import { usePathname } from "next/navigation";

import type { Locale } from "@/shared/i18n";

import { getLanguageHref } from "./navigation-paths";

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
