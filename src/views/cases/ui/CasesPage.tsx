import type { Dictionary, Locale } from "@/shared/i18n";

import type { CaseListItem } from "../api/types";
import { CaseBlock } from "./CaseBlock";

type CasesPageProps = {
  caseItems?: CaseListItem[];
  cases: Dictionary["pages"]["cases"];
  locale: Locale;
};

export const CasesPage = ({
  caseItems = [],
  cases,
  locale,
}: CasesPageProps) => (
  <div className="size-full min-h-0 overflow-y-auto px-0 py-8 sm:px-4 lg:py-12">
    <div className="mx-auto flex w-full max-w-310 flex-col gap-10 sm:gap-14 lg:gap-16">
      <h1 className="sr-only">{cases.title}</h1>
      {caseItems.map((caseItem, index) => (
        <CaseBlock
          caseData={caseItem}
          caseLabels={cases}
          index={index}
          key={caseItem.slug}
          locale={locale}
        />
      ))}
    </div>
  </div>
);
