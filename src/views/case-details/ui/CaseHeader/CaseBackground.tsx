import Image from "next/image";

import type { CaseDetail } from "@/views/case-details/api/types";

type CaseBackgroundProps = Pick<
  CaseDetail,
  "backgroundBlurImage" | "backgroundImage"
>;

export const CaseBackground = ({
  backgroundBlurImage,
  backgroundImage,
}: CaseBackgroundProps) => {
  if (!backgroundImage) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-120 md:h-140"
    >
      <div className="absolute inset-0 mask-[linear-gradient(to_bottom,transparent,#000_140px,#000_55%,transparent)] lg:mask-[linear-gradient(to_bottom,transparent,#000_140px,#000_55%,transparent),linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] lg:mask-intersect">
        <Image
          alt=""
          blurDataURL={backgroundBlurImage ?? undefined}
          className="object-cover object-top"
          fill
          placeholder={backgroundBlurImage ? "blur" : undefined}
          priority
          sizes="100vw"
          src={backgroundImage}
        />
      </div>
      <div className="absolute inset-0 bg-canvas/35" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-canvas/60 to-transparent" />
    </div>
  );
};
