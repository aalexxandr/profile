import Image from "next/image";
import clsx from "clsx";
import tabletSrc from "./assets/tablet.svg";
import type { FC, PropsWithChildren } from "react";

interface TabletProps extends PropsWithChildren {
  className?: string;
}

export const Tablet: FC<TabletProps> = ({ children, className }) => (
  <div className={clsx("relative h-129 w-108", className)}>
    <Image
      src={tabletSrc}
      alt="tablet"
      loading="eager"
      className="absolute inset-0 size-full"
    />
    <div className="absolute inset-0 p-6 pb-12">
      <div className="relative flex h-full flex-col items-center justify-center px-6 py-7 font-vcr text-[13px]/5 font-normal text-white">
        {children}
      </div>
    </div>
  </div>
);
