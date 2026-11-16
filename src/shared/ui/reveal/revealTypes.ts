import type { PropsWithChildren } from "react";

import type { RevealDirection } from "./revealClassNames";

export type RevealTag = "div" | "li";

export type RevealTrigger = "mount" | "visible";

export type RevealElementProps = PropsWithChildren<{
  as?: RevealTag;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
}>;
