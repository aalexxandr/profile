import clsx from "clsx";

import { ExternalLink } from "../ExternalLink";
import { hasProjectLink } from "./hasProjectLink";

type ProjectLinkProps = {
  ariaLabel: string;
  className?: string;
  href: string | null | undefined;
  label: string;
  privateLabel: string;
};

export const ProjectLink = ({
  ariaLabel,
  className,
  href,
  label,
  privateLabel,
}: ProjectLinkProps) =>
  hasProjectLink(href) ? (
    <ExternalLink aria-label={ariaLabel} className={className} href={href}>
      {label}
    </ExternalLink>
  ) : (
    <span
      className={clsx(
        "inline-flex max-w-full items-center font-vcr text-[12px] text-white/50 uppercase sm:text-[14px]",
        className,
      )}
    >
      {privateLabel}
    </span>
  );
