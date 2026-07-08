export const locales = ["ru", "en"] as const;
export const defaultLocale = "ru";

export type Locale = (typeof locales)[number];
export type PageKey = "home" | "cases" | "contacts";

export const pagePathByKey: Record<PageKey, string> = {
  cases: "/cases",
  contacts: "/contacts",
  home: "/",
};

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const getLocalizedPath = (page: PageKey, locale: Locale) => {
  const path = pagePathByKey[page];

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

export const getLocalizedPaths = (page: PageKey) => ({
  en: getLocalizedPath(page, "en"),
  ru: getLocalizedPath(page, "ru"),
  "x-default": getLocalizedPath(page, defaultLocale),
});

export const getSiteUrl = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    return siteUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required in production.");
  }

  return "http://localhost:3000";
};

export const getLocalizedUrls = (page: PageKey, siteUrl: string) => {
  const paths = getLocalizedPaths(page);

  return {
    en: `${siteUrl}${paths.en}`,
    ru: `${siteUrl}${paths.ru}`,
    "x-default": `${siteUrl}${paths["x-default"]}`,
  };
};
