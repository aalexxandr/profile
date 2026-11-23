import Image from "next/image";

import { ERROR_ILLUSTRATIONS } from "../config/illustrations";

const { src, width, height } = ERROR_ILLUSTRATIONS.serverError;

export const ServerErrorIllustration = () => (
  <Image
    alt=""
    className="mt-25 h-auto w-full min-[30rem]:mt-23.5 min-[30rem]:w-103 sm:mt-40 sm:w-106 min-[75.25rem]:mt-42"
    height={height}
    priority
    src={src}
    width={width}
  />
);
