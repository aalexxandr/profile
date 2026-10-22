import { getLocalizedPath, type Dictionary, type Locale } from "@/shared/i18n";
import type { CaseDetail } from "@/views/case-details/api/types";
import { getCaseFacts } from "@/views/case-details/lib/getCaseFacts";

import { CaseBackground } from "./CaseBackground";
import { CaseBackLink } from "./CaseBackLink";
import { CaseFacts } from "./CaseFacts";

type CaseHeaderProps = {
  caseItem: CaseDetail;
  cases: Dictionary["pages"]["cases"];
  locale: Locale;
};

export const CaseHeader = ({ caseItem, cases, locale }: CaseHeaderProps) => {
  const { detail } = cases;

  return (
    <header>
      <CaseBackground
        backgroundBlurImage={caseItem.backgroundBlurImage}
        backgroundImage={caseItem.backgroundImage}
      />
      <div className="mx-auto flex min-h-85 w-full max-w-310 flex-col gap-8 px-4 py-8 sm:px-6 md:min-h-100 lg:px-5">
        <CaseBackLink href={getLocalizedPath("cases", locale)}>
          {detail.backToCases}
        </CaseBackLink>
        <div className="mt-auto flex flex-col gap-3">
          <p className="m-0 font-vcr text-[12px] text-white/60 uppercase">
            {caseItem.category}
          </p>
          <h1 className="m-0 max-w-full text-3xl/9 font-bold wrap-break-word text-white uppercase sm:text-5xl/[52px]">
            {caseItem.name}
          </h1>
          <CaseFacts facts={getCaseFacts(caseItem, detail, locale)} />
        </div>
      </div>
    </header>
  );
};
