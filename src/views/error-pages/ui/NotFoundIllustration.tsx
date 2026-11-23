import Image from "next/image";

import { ERROR_ILLUSTRATIONS } from "../config/illustrations";

const { src, width, height } = ERROR_ILLUSTRATIONS.notFound;

// Anchored to the `relative` body, so the lamp hangs from the top of the page
// behind the site menu; the layer clips the picture horizontally so it never
// causes a horizontal scroll on phones. The top of the picture fades out above
// the lamp (which starts at ~34% of its height at every width), otherwise the
// white cord would run through the centred menu and the language switcher.
export const NotFoundIllustration = () => (
  <div className="pointer-events-none absolute inset-x-0 top-0 -z-1 flex justify-center overflow-x-clip">
    <Image
      alt=""
      className="-mt-15 h-auto w-136.5 max-w-none mask-[linear-gradient(to_bottom,transparent_16%,black_36%)] min-[30rem]:w-145.75 sm:w-171.5 min-[75.25rem]:-mt-17.5"
      height={height}
      priority
      src={src}
      width={width}
    />
  </div>
);
