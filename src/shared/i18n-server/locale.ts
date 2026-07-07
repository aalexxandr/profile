import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/shared/i18n";

type LocaleParams = Promise<{ locale: string }>;

export const getValidatedLocale = async (
  params: LocaleParams,
): Promise<Locale> => {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
};
