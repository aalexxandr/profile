import type { CaseFactId } from "@/views/case-details/model/types";

import { factIcons } from "./factIcons";

type FactLabelProps = {
  children: string;
  id: CaseFactId;
};

export const FactLabel = ({ children, id }: FactLabelProps) => {
  const Icon = factIcons[id];

  return (
    <dt className="m-0 flex items-center gap-2 font-vcr text-[12px] text-white/60 uppercase">
      <Icon
        aria-hidden="true"
        className="size-3 shrink-0"
        data-icon={id}
        focusable="false"
      />
      {children}
    </dt>
  );
};
