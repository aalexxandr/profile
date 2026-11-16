"use client";

import clsx from "clsx";
import { useRef, useState } from "react";

import {
  animationClassNameByDirection,
  REVEAL_BASE_CLASS_NAME,
  REVEAL_PAUSED_CLASS_NAME,
} from "./revealClassNames";
import { getRevealStyle } from "./getRevealStyle";
import type { RevealElementProps } from "./revealTypes";
import { useInViewOnce } from "./useInViewOnce";

// Same entrance as on mount, held paused (hidden, delay not counting) until
// the block first enters the viewport or receives keyboard focus.
export const RevealInView = ({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealElementProps) => {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const isInView = useInViewOnce(ref);
  const [hasFocus, setHasFocus] = useState(false);
  const isRevealed = isInView || hasFocus;

  return (
    <Tag
      className={clsx(
        REVEAL_BASE_CLASS_NAME,
        animationClassNameByDirection[direction],
        !isRevealed && REVEAL_PAUSED_CLASS_NAME,
        className,
      )}
      onFocusCapture={() => setHasFocus(true)}
      ref={ref}
      style={getRevealStyle(delay)}
    >
      {children}
    </Tag>
  );
};
