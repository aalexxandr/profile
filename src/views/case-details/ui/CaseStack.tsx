import type { Dictionary } from "@/shared/i18n";

type CaseStackProps = {
  cases: Dictionary["pages"]["cases"];
  stack: string[];
};

export const CaseStack = ({ cases, stack }: CaseStackProps) => (
  <section
    aria-labelledby="case-stack-title"
    className="flex flex-col gap-5 lg:grid lg:grid-cols-[287px_1fr] lg:gap-8"
  >
    <h2
      className="m-0 font-vcr text-[18px] text-white uppercase sm:text-[24px]"
      id="case-stack-title"
    >
      {cases.detail.stackTitle}
    </h2>
    <ul className="m-0 flex list-none flex-row flex-wrap gap-x-6 gap-y-1 border-12 border-solid border-transparent bg-white bg-clip-padding p-3 font-mono text-[12px]/[18px] text-canvas [border-image:url('/code-border.png')_25/14px/2px] sm:border-25 sm:p-4 sm:pt-0 sm:text-[14px]/[21px] sm:[border-image:url('/code-border.png')_25/30px/5px]">
      {stack.map((technology) => (
        <li className="flex gap-2" key={technology}>
          <span aria-hidden="true">/</span>
          {technology}
        </li>
      ))}
    </ul>
  </section>
);
