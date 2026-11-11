import type { CaseFactId } from "@/views/case-details/model/types";

import CompanyIcon from "./assets/company.svg?svgr";
import PeriodIcon from "./assets/period.svg?svgr";
import RoleIcon from "./assets/role.svg?svgr";
import TeamIcon from "./assets/team.svg?svgr";

export const factIcons: Record<CaseFactId, typeof RoleIcon> = {
  company: CompanyIcon,
  period: PeriodIcon,
  role: RoleIcon,
  team: TeamIcon,
};
