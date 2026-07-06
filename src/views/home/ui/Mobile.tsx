import Image from "next/image";
import clsx from "clsx";
import mobileSrc from "./assets/mobile.svg";
import type { FC, PropsWithChildren } from "react";

interface MobileProps extends PropsWithChildren {
  className?: string;
}

export const Mobile: FC<MobileProps> = ({ children, className }) => (
  <div className={clsx("relative h-129 w-82", className)}>
    <Image
      src={mobileSrc}
      alt="mobile"
      loading="eager"
      className="absolute inset-0 size-full"
    />
    <div className="absolute inset-0 p-6 pb-12">
      <div className="relative flex h-full flex-col items-center justify-center px-2 py-7 font-vcr text-[12px]/4.5 font-normal text-white">
        {children}
      </div>
    </div>
  </div>
);
