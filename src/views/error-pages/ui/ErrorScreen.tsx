import clsx from "clsx";
import type { ReactNode } from "react";

import { CursorGlow } from "@/shared/ui";

import type { ErrorScreenVariant } from "../config/illustrations";
import { NotFoundIllustration } from "./NotFoundIllustration";
import { ServerErrorIllustration } from "./ServerErrorIllustration";

type ErrorScreenProps = {
  variant: ErrorScreenVariant;
  title: string;
  description: string;
  children: ReactNode;
};

// The 404/500 layout: a pixel-art picture, an uppercase title, a description
// and the actions in a 500 px column from `sm`.
export const ErrorScreen = ({
  variant,
  title,
  description,
  children,
}: ErrorScreenProps) => {
  const isNotFound = variant === "notFound";

  return (
    <div className="flex flex-col items-center px-4 pb-12 text-white sm:px-6">
      {/* Before the picture: the 404 picture shares the glow's `-z-1` layer,
          and the earlier element is painted below, so the cat stays on top. */}
      <CursorGlow />
      {isNotFound ? <NotFoundIllustration /> : <ServerErrorIllustration />}
      <div className="flex w-full flex-col items-center gap-5 sm:w-125">
        <div
          className={clsx(
            "flex w-full flex-col gap-2.5",
            isNotFound
              ? "mt-96 items-center text-center min-[30rem]:mt-110.25 sm:mt-116 min-[75.25rem]:mt-116.5"
              : "mt-12.5 min-[30rem]:mt-20 sm:mt-21.25 sm:text-center",
          )}
        >
          <h1 className="m-0 font-vcr text-[20px]/6.5 uppercase sm:text-[24px]/8 min-[75.25rem]:text-[30px]/9">
            {title}
          </h1>
          <p className="m-0 font-vcr text-base/5.5 sm:text-[18px]/6">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
