"use client";

import clsx from "clsx";
import { FC, useState } from "react";
import Image from "next/image";
import lampOn from "./assets/lamp-on.svg";
import lampOff from "./assets/lamp-off.svg";

interface LampProps {
  className?: string;
}

export const Lamp: FC<LampProps> = ({ className }) => {
  const [isLampOn, setIsLampOn] = useState(true);

  const toggleLamp = () => {
    setIsLampOn(!isLampOn);
  };

  return (
    <div
      className={clsx(
        "flex w-fit cursor-pointer items-center justify-center",
        className,
      )}
      onClick={toggleLamp}
    >
      <Image src={isLampOn ? lampOn : lampOff} alt="lamp" unoptimized />
      {isLampOn && (
        <div className="absolute -top-10 left-25 z-[-1] size-81 transform-[translate3d(0,0,0)_translateX(-50%)] opacity-90 will-change-[filter] [-webkit-filter:url(#svg-blur)] [background:linear-gradient(94.84deg,#FF6B00_51.74%,#232323_56.65%)]">
          <svg
            id="svg-filter"
            className="hidden"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter
                id="svg-blur"
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="110" />
              </filter>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
};
