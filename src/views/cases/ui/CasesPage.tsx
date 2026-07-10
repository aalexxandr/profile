import type { Dictionary } from "@/shared/i18n";

import { RetroWindow } from "./RetroWindow";

type CasesPageProps = {
  cases: Dictionary["pages"]["cases"];
};

const STATUS_NUMBER_MIN = 2;
const STATUS_NUMBER_MAX = 1000;

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const CASES_STATUS_NUMBER = getRandomInt(STATUS_NUMBER_MIN, STATUS_NUMBER_MAX);

export const CasesPage = ({ cases }: CasesPageProps) => (
  <div className="grid size-full min-h-0 place-items-center px-4 py-8 sm:px-6">
    <RetroWindow
      className="w-full max-w-140"
      controlLabels={cases.controlLabels}
      statusText={`${CASES_STATUS_NUMBER} ${cases.statusSuffix}`}
      title={cases.title}
    >
      <p className="text-center text-[18px]/7 text-control-fg uppercase sm:text-[20px]/8">
        {cases.title}
      </p>
    </RetroWindow>
  </div>
);
