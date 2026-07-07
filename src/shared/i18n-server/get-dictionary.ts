import "server-only";

import type { Dictionary, Locale } from "@/shared/i18n";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((module) => module.en),
  ru: () => import("./dictionaries/ru").then((module) => module.ru),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
