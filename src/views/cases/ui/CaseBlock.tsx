import clsx from "clsx";
import Image from "next/image";

import type { Dictionary, Locale } from "@/shared/i18n";
import { Button, ExternalLink } from "@/shared/ui";

import { type CaseShort } from "../model/case";
import ArrowRightIcon from "./assets/case-block/arrow-right.svg?svgr";
import { RetroWindow } from "./RetroWindow";

type CaseBlockProps = {
  caseData: CaseShort;
  caseLabels: Dictionary["pages"]["cases"];
  className?: string;
  index: number;
  locale: Locale;
};

const STATUS_NUMBER_MIN = 2;
const STATUS_NUMBER_MAX = 1000;
const STATUS_NUMBER_RANGE = STATUS_NUMBER_MAX - STATUS_NUMBER_MIN + 1;

const getStatusCount = (slug: CaseShort["slug"]) => {
  let hash = 0;

  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) % STATUS_NUMBER_RANGE;
  }

  return STATUS_NUMBER_MIN + hash;
};

export const CaseBlock = ({
  caseData,
  caseLabels,
  className,
  index,
  locale,
}: CaseBlockProps) => {
  const isEven = index % 2 === 0;
  const caseHref = `/${locale}/cases/${caseData.slug}`;
  const objectsCount = getStatusCount(caseData.slug);

  return (
    <article
      className={clsx(
        "flex w-full flex-col items-center p-2.5 sm:gap-5 sm:px-6 lg:w-auto lg:px-5",
        isEven ? "lg:ml-auto lg:flex-row" : "lg:mr-auto lg:flex-row-reverse",
        className,
      )}
    >
      <Image
        alt={caseData.name}
        className="h-auto w-65 sm:mb-0 sm:w-74 md:w-110 lg:w-108"
        loading="lazy"
        src={caseData.image}
        placeholder="blur"
        blurDataURL={caseData.blurImage}
        width={520}
        height={430}
      />
      <RetroWindow
        className="w-65 sm:w-95 md:w-132 lg:w-142 xl:w-160"
        controlLabels={caseLabels.controlLabels}
        objectsCount={objectsCount}
        title={`${caseData.name}`}
      >
        <div className="flex h-73 flex-col items-start font-sans sm:h-50">
          <h2 className="max-w-full truncate text-2xl/7 font-bold text-white uppercase sm:text-[32px]/[34px]">
            {caseData.name}
          </h2>
          <ExternalLink
            aria-label={`${caseLabels.actions.projectLink}: ${caseData.name}`}
            className="mt-2"
            href={caseData.projectLink}
          >
            {caseLabels.actions.projectLink}
          </ExternalLink>
          <p className="mt-6 mb-0 line-clamp-3 text-sm/5 font-bold text-white sm:text-base/6 xl:line-clamp-2">
            {caseData.shortDesc}
          </p>
          <div className="mt-5 w-full sm:w-51.25 md:w-66.25">
            <Button
              aria-label={`${caseLabels.actions.moreInformation}: ${caseData.name}`}
              className="flex h-7 items-center gap-2 sm:h-8.5"
              href={caseHref}
            >
              <span className="flex items-center gap-2">
                {caseLabels.actions.moreInformation}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-3.75 shrink-0"
                  focusable={false}
                />
              </span>
            </Button>
          </div>
        </div>
      </RetroWindow>
    </article>
  );
};
