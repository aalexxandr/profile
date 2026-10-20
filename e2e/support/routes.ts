export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

// Page paths without the locale prefix. "" is the home page.
export const pageSuffixes = [
  "",
  "/cases",
  "/contacts",
  "/cases/spectre",
  "/cases/orbit",
  "/cases/nova",
] as const;

export const allPaths = locales.flatMap((locale) =>
  pageSuffixes.map((suffix) => ({
    locale,
    path: `/${locale}${suffix}`,
    suffix,
  })),
);
