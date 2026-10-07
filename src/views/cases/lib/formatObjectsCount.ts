import type { Dictionary, Locale } from "@/shared/i18n";

type ObjectsLabels = Dictionary["pages"]["cases"]["status"]["objects"];

export const formatObjectsCount = (
  count: number,
  locale: Locale,
  labels: ObjectsLabels,
) => {
  const category = new Intl.PluralRules(locale).select(count);

  return `${count} ${labels[category] ?? labels.other}`;
};
