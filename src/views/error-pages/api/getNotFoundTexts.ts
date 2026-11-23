import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n-server";

export type NotFoundTexts = Dictionary["errors"]["notFound"];

// `not-found.tsx` receives no route params, so it loads the 404 texts of every
// locale on the server and the page picks its own on the client (a few hundred
// bytes on the 404 response only, no dictionary in the client bundle).
export const getNotFoundTexts = async (): Promise<
  Record<Locale, NotFoundTexts>
> => {
  const entries = await Promise.all(
    locales.map(
      async (locale) =>
        [locale, (await getDictionary(locale)).errors.notFound] as const,
    ),
  );

  return Object.fromEntries(entries) as Record<Locale, NotFoundTexts>;
};
