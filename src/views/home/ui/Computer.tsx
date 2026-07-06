import Image from "next/image";
import computerSrc from "./assets/computer.svg";
import { FC, PropsWithChildren } from "react";
import clsx from "clsx";

interface ComputerProps extends PropsWithChildren {
  className?: string;
}

export const Computer: FC<ComputerProps> = ({ children, className }) => (
  <div className={clsx("relative h-127 w-149 p-10", className)}>
    <Image
      src={computerSrc}
      alt="computer"
      loading="eager"
      className="absolute inset-0"
    />
    <div className="absolute top-0 left-1/2 h-127 w-149 -translate-x-1/2 p-6 pb-18">
      <div className="relative flex h-full flex-col items-center justify-center px-12.5 py-9.5 font-vcr text-[14px]/5 font-normal text-white">
        {children}
      </div>
    </div>
  </div>
);
