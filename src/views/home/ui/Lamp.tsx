"use client";

import clsx from "clsx";
import { CSSProperties, FC, useEffect, useState } from "react";
import LampIcon from "./assets/lamp.svg?svgr";

interface LampProps {
  className?: string;
}

const LAMP_TURN_ON_DELAY_MS = 950;
type LampColorVars = CSSProperties & {
  "--lamp-accent": string;
  "--lamp-shade": string;
};

export const Lamp: FC<LampProps> = ({ className }) => {
  const [isLampOn, setIsLampOn] = useState(false);

  useEffect(() => {
    const turnOnTimer = window.setTimeout(() => {
      setIsLampOn(true);
    }, LAMP_TURN_ON_DELAY_MS);

    return () => {
      window.clearTimeout(turnOnTimer);
    };
  }, []);

  const toggleLamp = () => {
    setIsLampOn(!isLampOn);
  };

  const lampColorVars: LampColorVars = {
    "--lamp-accent": isLampOn ? "#ff6b00" : "#554a4a",
    "--lamp-shade": isLampOn ? "#ff923f" : "#888888",
  };

  return (
    <div
      className={clsx(
        "relative flex w-fit cursor-pointer items-center justify-center",
        className,
      )}
      onClick={toggleLamp}
    >
      <LampIcon role="img" aria-label="lamp" style={lampColorVars} />
      <div
        className={clsx(
          "absolute -top-10 left-35 z-[-1] size-81 transform-[translate3d(0,0,0)_translateX(-50%)] transition-opacity duration-700 ease-out will-change-[filter,opacity] [-webkit-filter:url(#lamp-light-blur-filter)] [background:linear-gradient(94.84deg,#ff6b00_51.74%,#232323_56.65%)] motion-reduce:transition-none",
          isLampOn ? "opacity-90" : "opacity-0",
        )}
      />
    </div>
  );
};
