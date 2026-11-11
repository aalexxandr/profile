import type { Dictionary, Locale } from "@/shared/i18n";

import type { CaseDetail } from "../api/types";
import { CaseAbout } from "./CaseAbout";
import { CaseAchievements } from "./CaseAchievements";
import { CaseHeader } from "./CaseHeader";
import { CaseStack } from "./CaseStack";

type CaseDetailPageProps = {
  caseItem: CaseDetail;
  cases: Dictionary["pages"]["cases"];
  locale: Locale;
};

export const CaseDetailPage = ({
  caseItem,
  cases,
  locale,
}: CaseDetailPageProps) => (
  <div className="size-full min-h-0 overflow-y-auto pb-12">
    <article>
      <CaseHeader caseItem={caseItem} cases={cases} locale={locale} />
      <div className="mx-auto flex w-full max-w-310 flex-col gap-10 px-4 pt-6 sm:px-6 lg:gap-14 lg:px-5">
        <CaseAbout caseItem={caseItem} cases={cases} />
        <CaseStack cases={cases} stack={caseItem.stack} />
        <CaseAchievements achievements={caseItem.achievements} cases={cases} />
      </div>
    </article>
  </div>
);
