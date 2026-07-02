"use client";

import { FC } from "react";
import { Typewriter } from "react-simple-typewriter";
import clsx from "clsx";

type TypewriterTextSequenceProps = {
  texts: readonly string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
};

const DEFAULT_SPEED = 50;
const DEFAULT_DELETE_SPEED = 70;
const DEFAULT_DELAY_SPEED = 1000;

export const TypewriterTextSequence: FC<TypewriterTextSequenceProps> = ({
  texts,
  className,
  speed = DEFAULT_SPEED,
  deleteSpeed = DEFAULT_DELETE_SPEED,
  delaySpeed = DEFAULT_DELAY_SPEED,
}) => {
  if (texts.length === 0) {
    return null;
  }

  return (
    <span className={clsx("block w-full", className)}>
      <span className="sr-only">{texts.join(" ")}</span>
      <span aria-hidden="true" className="whitespace-pre-line">
        <Typewriter
          words={[...texts]}
          loop={0}
          typeSpeed={speed}
          deleteSpeed={deleteSpeed}
          delaySpeed={delaySpeed}
          cursor
          cursorStyle={
            <span className="ml-[0.14em] inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-current shadow-[0_0_8px_rgb(255_255_255/0.45)]" />
          }
        />
      </span>
    </span>
  );
};
