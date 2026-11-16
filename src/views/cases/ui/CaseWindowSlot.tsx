"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";

import { useReservedHeight } from "../lib/useReservedHeight";

type CaseWindowSlotProps = {
  children: ReactNode;
};

// Keeps the room of the expanded window on wide screens, so collapsing it
// does not re-centre it next to the picture and move its title bar.
export const CaseWindowSlot = ({ children }: CaseWindowSlotProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const reservedHeight = useReservedHeight(windowRef);
  const style: CSSProperties | undefined =
    reservedHeight === undefined
      ? undefined
      : ({ "--case-window-height": `${reservedHeight}px` } as CSSProperties);

  return (
    <div className="lg:min-h-(--case-window-height)" style={style}>
      <div ref={windowRef}>{children}</div>
    </div>
  );
};
