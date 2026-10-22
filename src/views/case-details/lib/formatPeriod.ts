import type { Locale } from "@/shared/i18n";

// Month and year only: the Russian formatter appends a year suffix ("г.").
const formatMonth = (date: string, locale: Locale) => {
  const parts = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).formatToParts(new Date(date));
  const part = (type: "month" | "year") =>
    parts.find((item) => item.type === type)?.value;

  return `${part("month")} ${part("year")}`;
};

export const formatPeriod = (
  startedAt: string,
  endedAt: string | null,
  presentLabel: string,
  locale: Locale,
) =>
  `${formatMonth(startedAt, locale)} – ${
    endedAt ? formatMonth(endedAt, locale) : presentLabel
  }`;
