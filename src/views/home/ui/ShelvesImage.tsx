import { SHELVES_MIN_WIDTH_QUERY, TRANSPARENT_PIXEL } from "../config";
import shelvesSrc from "./assets/shelves.svg";

type ShelvesImageProps = {
  alt: string;
};

// The shelves are the largest picture above the fold on desktop (the LCP
// element) and are hidden below `lg`. next/image cannot be both eager and
// skipped on phones, and it does not optimize SVG anyway, so this is a plain
// <picture> (same technique as DeviceBackgrounds): the real file is offered
// only to wide screens, phones get a tiny inline placeholder.
export const ShelvesImage = ({ alt }: ShelvesImageProps) => (
  <picture>
    <source media={SHELVES_MIN_WIDTH_QUERY} srcSet={shelvesSrc.src} />
    <img
      src={TRANSPARENT_PIXEL}
      alt={alt}
      width={shelvesSrc.width}
      height={shelvesSrc.height}
      loading="eager"
      fetchPriority="high"
    />
  </picture>
);
