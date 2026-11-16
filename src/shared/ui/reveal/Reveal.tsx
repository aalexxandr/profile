import clsx from "clsx";

import {
  animationClassNameByDirection,
  REVEAL_BASE_CLASS_NAME,
} from "./revealClassNames";
import { getRevealStyle } from "./getRevealStyle";
import type { RevealElementProps, RevealTrigger } from "./revealTypes";
import { RevealInView } from "./RevealInView";

type RevealProps = RevealElementProps & {
  trigger?: RevealTrigger;
};

// Entrance animation: "mount" plays on load (CSS only), "visible" waits until
// the block first enters the viewport.
export const Reveal = ({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  direction = "up",
  trigger = "mount",
}: RevealProps) => {
  if (trigger === "visible") {
    return (
      <RevealInView
        as={Tag}
        className={className}
        delay={delay}
        direction={direction}
      >
        {children}
      </RevealInView>
    );
  }

  return (
    <Tag
      className={clsx(
        REVEAL_BASE_CLASS_NAME,
        animationClassNameByDirection[direction],
        className,
      )}
      style={getRevealStyle(delay)}
    >
      {children}
    </Tag>
  );
};
