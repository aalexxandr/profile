import clsx from "clsx";

import type { CaseFact } from "@/views/case-details/model/types";

import { FactLabel } from "./FactLabel";

type CaseFactsProps = {
  facts: CaseFact[];
};

export const CaseFacts = ({ facts }: CaseFactsProps) => (
  <dl className="m-0 grid grid-cols-2 text-sm/5 text-white sm:text-base/6 lg:flex lg:w-fit lg:self-start [&>div]:border-dashed [&>div]:border-white/20 lg:[&>div+div]:border-l lg:[&>div:first-child]:pl-0 [&>div:nth-child(even)]:border-l [&>div:nth-child(n+3)]:border-t lg:[&>div:nth-child(n+3)]:border-t-0 max-lg:[&>div:nth-child(odd)]:pl-0">
    {facts.map(({ id, label, value }) => (
      <div
        className={clsx(
          "flex flex-col gap-1 px-4 py-3",
          id === "period" && "capitalize",
        )}
        key={id}
      >
        <FactLabel id={id}>{label}</FactLabel>
        <dd className="m-0">{value}</dd>
      </div>
    ))}
  </dl>
);
