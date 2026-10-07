import type { Locale } from "@/shared/i18n";

export const getLanguageHref = (pathname: string, locale: Locale) => {
  const segments = pathname.split("/");
  segments[1] = locale;

  return segments.join("/") || `/${locale}`;
};

export const isItemActive = (pathname: string, href: string) => {
  if (href === "/ru" || href === "/en") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};
