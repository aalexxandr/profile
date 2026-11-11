import type { Dictionary } from "@/shared/i18n";

import type { CaseDetail } from "../api/types";

type CaseAchievementsProps = {
  achievements: CaseDetail["achievements"];
  cases: Dictionary["pages"]["cases"];
};

export const CaseAchievements = ({
  achievements,
  cases,
}: CaseAchievementsProps) => {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="case-achievements-title"
      className="flex flex-col gap-5 lg:grid lg:grid-cols-[287px_1fr] lg:gap-8"
    >
      <h2
        className="m-0 font-vcr text-[24px] text-white uppercase sm:text-[32px]"
        id="case-achievements-title"
      >
        {cases.detail.achievementsTitle}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-6 p-0">
        {achievements.map(({ description, metric, title }, index) => (
          <li
            className="flex flex-col gap-2 border-t border-dashed border-white/20 pt-6 first:border-t-0 first:pt-0 sm:flex-row sm:gap-5"
            key={title}
          >
            <span
              aria-hidden="true"
              className="font-vcr text-[14px] text-white/40 sm:w-8 sm:shrink-0 sm:pt-0.5"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-base/6 font-bold text-white">{title}</span>
              <span className="text-sm/5 text-white/80 sm:text-base/6">
                {description}
              </span>
              <span className="mt-1 text-sm/5 font-bold text-white sm:text-base/6">
                {metric}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
