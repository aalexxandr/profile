import type { Dictionary, Locale } from "@/shared/i18n";

type TeamSizeUnit = Dictionary["pages"]["cases"]["detail"]["teamSizeUnit"];

// "22 человека", "1 person": the unit agrees with the number in the locale.
export const formatTeamSize = (
  teamSize: number,
  unit: TeamSizeUnit,
  locale: Locale,
) =>
  `${teamSize} ${unit[new Intl.PluralRules(locale).select(teamSize)] ?? unit.other}`;
