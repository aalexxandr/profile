import Image from "next/image";

import { getLocalizedPath, type Dictionary, type Locale } from "@/shared/i18n";
import { Button, ExternalLink } from "@/shared/ui";

import type { CaseFull } from "../model/case";
import { RetroWindow } from "./RetroWindow";

type CaseDetailPageProps = {
  caseItem: CaseFull;
  cases: Dictionary["pages"]["cases"];
  locale: Locale;
};

export const CaseDetailPage = ({
  caseItem,
  cases,
  locale,
}: CaseDetailPageProps) => (
  <div className="size-full min-h-0 overflow-y-auto px-0 py-8 sm:px-4 lg:py-12">
    <article className="mx-auto flex w-full max-w-310 flex-col items-center gap-5 p-2.5 sm:px-6 lg:flex-row lg:items-start lg:px-5">
      <Image
        alt={caseItem.name}
        className="h-auto w-65 sm:w-74 md:w-110 lg:w-108"
        blurDataURL={caseItem.blurImage}
        height={430}
        placeholder="blur"
        src={caseItem.image}
        width={520}
      />
      <RetroWindow
        className="w-65 sm:w-95 md:w-132 lg:w-142 xl:w-160"
        controlLabels={cases.controlLabels}
        statusLabel={`${cases.detail.categoryLabel}: ${caseItem.category}`}
        title={caseItem.name}
      >
        <div className="flex w-full flex-col items-start font-sans text-white">
          <h1 className="max-w-full text-2xl/7 font-bold uppercase sm:text-[32px]/[34px]">
            {caseItem.name}
          </h1>
          <ExternalLink
            aria-label={`${cases.actions.projectLink}: ${caseItem.name}`}
            className="mt-2"
            href={caseItem.projectLink}
          >
            {cases.actions.projectLink}
          </ExternalLink>
          <p className="mt-6 mb-0 text-sm/5 font-bold sm:text-base/6">
            {caseItem.description}
          </p>
          <dl className="mt-6 mb-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm/5 sm:text-base/6">
            <dt className="font-vcr text-accent uppercase">
              {cases.detail.roleLabel}
            </dt>
            <dd className="m-0">{caseItem.role}</dd>
            <dt className="font-vcr text-accent uppercase">
              {cases.detail.stackLabel}
            </dt>
            <dd className="m-0">{caseItem.stack.join(", ")}</dd>
          </dl>
          <h2 className="mt-6 mb-0 font-vcr text-[14px] text-accent uppercase">
            {cases.detail.achievementsTitle}
          </h2>
          <ul className="mt-3 mb-0 flex list-none flex-col gap-4 p-0">
            {caseItem.achievements.map(({ description, metric, title }) => (
              <li className="flex flex-col gap-1" key={title}>
                <span className="text-xl/6 font-bold">
                  {metric} <span className="text-sm/5">{title}</span>
                </span>
                <span className="text-sm/5">{description}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 w-full sm:w-51.25 md:w-66.25">
            <Button href={getLocalizedPath("cases", locale)}>
              {cases.detail.backToCases}
            </Button>
          </div>
        </div>
      </RetroWindow>
    </article>
  </div>
);
