import type { Dictionary, Locale } from "@/shared/i18n";

type ObjectsLabels = Dictionary["pages"]["cases"]["status"]["objects"];

export const getObjectsLabel = (
  count: number,
  locale: Locale,
  labels: ObjectsLabels,
) => labels[new Intl.PluralRules(locale).select(count)] ?? labels.other;
