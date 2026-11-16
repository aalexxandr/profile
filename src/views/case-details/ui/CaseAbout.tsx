import type { Dictionary } from "@/shared/i18n";
import { ProjectLink, Reveal } from "@/shared/ui";

import type { CaseDetail } from "../api/types";

type CaseAboutProps = {
  caseItem: Pick<CaseDetail, "description" | "name" | "projectLink">;
  cases: Dictionary["pages"]["cases"];
};

export const CaseAbout = ({ caseItem, cases }: CaseAboutProps) => (
  <Reveal trigger="visible">
    <section
      aria-labelledby="case-about-title"
      className="flex flex-col gap-5 lg:grid lg:grid-cols-[287px_1fr] lg:gap-8"
    >
      <h2
        className="m-0 font-vcr text-[18px] text-white uppercase sm:text-[24px]"
        id="case-about-title"
      >
        {cases.detail.aboutTitle}
      </h2>
      <div className="flex flex-col items-start gap-5">
        <p className="m-0 text-sm/5 font-bold text-white/80 sm:text-base/6">
          {caseItem.description}
        </p>
        <ProjectLink
          ariaLabel={`${cases.actions.projectLink}: ${caseItem.name}`}
          href={caseItem.projectLink}
          label={cases.actions.projectLink}
          privateLabel={cases.actions.projectPrivate}
        />
      </div>
    </section>
  </Reveal>
);
