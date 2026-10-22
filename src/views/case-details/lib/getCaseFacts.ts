import type { Dictionary, Locale } from "@/shared/i18n";

import type { CaseDetail } from "../api/types";
import type { CaseFact } from "../model/types";
import { formatPeriod } from "./formatPeriod";
import { formatTeamSize } from "./formatTeamSize";

type CaseFactsSource = Pick<
  CaseDetail,
  "company" | "endedAt" | "role" | "startedAt" | "teamSize"
>;

// The facts of the header in display order; a missing company or team size
// has no fact at all.
export const getCaseFacts = (
  caseItem: CaseFactsSource,
  detail: Dictionary["pages"]["cases"]["detail"],
  locale: Locale,
): CaseFact[] => {
  const facts: (CaseFact | null)[] = [
    {
      id: "role",
      label: detail.roleLabel,
      value: detail.roles[caseItem.role],
    },
    {
      id: "period",
      label: detail.periodLabel,
      value: formatPeriod(
        caseItem.startedAt,
        caseItem.endedAt,
        detail.periodPresent,
        locale,
      ),
    },
    caseItem.company
      ? { id: "company", label: detail.companyLabel, value: caseItem.company }
      : null,
    caseItem.teamSize !== null
      ? {
          id: "team",
          label: detail.teamSizeLabel,
          value: formatTeamSize(caseItem.teamSize, detail.teamSizeUnit, locale),
        }
      : null,
  ];

  return facts.filter((fact) => fact !== null);
};
