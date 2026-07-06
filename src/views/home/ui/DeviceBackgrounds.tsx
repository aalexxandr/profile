import type { PropsWithChildren } from "react";
import { Reveal } from "@/shared/ui/Reveal";
import computerSrc from "./assets/computer.svg";
import mobileSrc from "./assets/mobile.svg";
import tabletSrc from "./assets/tablet.svg";

export const DeviceBackgrounds = ({ children }: PropsWithChildren) => (
  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 lg:bottom-40 lg:translate-y-0">
    <Reveal delay={360}>
      <div className="relative h-129 w-82 md:w-108 lg:h-127 lg:w-149 lg:p-10">
        <picture className="absolute inset-0 block">
          <source media="(min-width: 1024px)" srcSet={computerSrc.src} />
          <source media="(min-width: 768px)" srcSet={tabletSrc.src} />
          <img
            src={mobileSrc.src}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="size-full"
          />
        </picture>
        <div className="absolute inset-0 p-6 pb-12 lg:inset-auto lg:top-0 lg:left-1/2 lg:h-127 lg:w-149 lg:-translate-x-1/2 lg:p-6 lg:pb-18">
          <div className="relative flex h-full flex-col items-center justify-center px-2 py-7 font-vcr text-[12px]/4.5 font-normal text-white md:px-6 md:text-[13px]/5 lg:px-12.5 lg:py-9.5 lg:text-[14px]/5">
            {children}
          </div>
        </div>
      </div>
    </Reveal>
  </div>
);
