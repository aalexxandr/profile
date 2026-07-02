"use client";

import { FC } from "react";
import { Typewriter } from "react-simple-typewriter";
import clsx from "clsx";

type TypewriterTextProps = {
  text: string;
  className?: string;
  speed?: number;
};

const DEFAULT_SPEED = 200;

export const TypewriterText: FC<TypewriterTextProps> = ({
  text,
  className,
  speed = DEFAULT_SPEED,
}) => {
  return (
    <span className={clsx("block w-full", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="whitespace-pre-line">
        <Typewriter
          words={[text]}
          loop={1}
          typeSpeed={speed}
          delaySpeed={1000}
          cursor
          cursorStyle={
            <span className="ml-[0.14em] inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-current shadow-[0_0_8px_rgb(255_255_255/0.45)]" />
          }
        />
      </span>
    </span>
  );
};
