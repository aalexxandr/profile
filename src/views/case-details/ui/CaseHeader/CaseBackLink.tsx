import Link from "next/link";

import ArrowLeftIcon from "./assets/arrow-left.svg?svgr";

type CaseBackLinkProps = {
  children: string;
  href: string;
};

export const CaseBackLink = ({ children, href }: CaseBackLinkProps) => (
  <Link
    className="inline-flex w-fit items-center gap-2 font-vcr text-[12px] text-accent uppercase no-underline transition-colors outline-none hover:text-white focus-visible:text-focus-ring active:text-accent-active sm:text-[14px]"
    href={href}
  >
    <ArrowLeftIcon
      aria-hidden="true"
      className="size-3.5 shrink-0"
      focusable="false"
    />
    {children}
  </Link>
);
