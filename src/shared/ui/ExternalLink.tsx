import clsx from "clsx";
import type { ComponentProps } from "react";

import ExternalLinkIcon from "./external-link.svg?svgr";

type ExternalLinkProps = ComponentProps<"a">;

export const ExternalLink = ({
  children,
  className,
  rel = "noopener noreferrer",
  target = "_blank",
  ...props
}: ExternalLinkProps) => (
  <a
    {...props}
    className={clsx(
      "inline-flex max-w-full items-center gap-2 font-vcr text-[12px] text-accent uppercase no-underline transition-colors outline-none hover:text-white focus-visible:text-focus-ring active:text-accent-active sm:text-[14px]",
      className,
    )}
    rel={rel}
    target={target}
  >
    {children}
    <ExternalLinkIcon
      aria-hidden="true"
      className="size-3.5 shrink-0"
      focusable={false}
    />
  </a>
);
