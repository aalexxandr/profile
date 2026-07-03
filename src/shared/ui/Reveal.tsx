import clsx from "clsx";
import type { CSSProperties, PropsWithChildren } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "fade";

interface RevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  direction?: RevealDirection;
}

const animationClassNameByDirection: Record<RevealDirection, string> = {
  down: "animate-reveal-down",
  fade: "animate-reveal-fade",
  left: "animate-reveal-left",
  right: "animate-reveal-right",
  up: "animate-reveal-up",
};

export const Reveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) => {
  const style =
    delay > 0
      ? ({ animationDelay: `${delay}ms` } satisfies CSSProperties)
      : undefined;

  return (
    <div
      className={clsx(
        "motion-reduce:animate-none motion-reduce:opacity-100",
        animationClassNameByDirection[direction],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
