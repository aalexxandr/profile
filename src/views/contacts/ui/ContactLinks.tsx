import clsx from "clsx";

import type { Dictionary } from "@/shared/i18n";

import {
  CONTACT_EMAIL,
  CONTACT_LINKEDIN_URL,
  CONTACT_TELEGRAM_URL,
} from "../config";
import LinkedinIcon from "./assets/linkedin.svg?svgr";
import MailIcon from "./assets/mail.svg?svgr";
import TelegramIcon from "./assets/telegram.svg?svgr";

type ContactLinksProps = {
  labels: Dictionary["pages"]["contacts"]["links"];
};

const linkClassName = clsx(
  "inline-flex min-h-11 items-center gap-2 font-vcr text-[14px] text-white no-underline transition-colors hover:text-accent focus-visible:text-accent active:text-accent-active motion-reduce:transition-none",
);

const iconClassName = "size-6 shrink-0";

export const ContactLinks = ({ labels }: ContactLinksProps) => (
  <div className="flex flex-col gap-1 lg:items-end">
    <a className={linkClassName} href={`mailto:${CONTACT_EMAIL}`}>
      <MailIcon
        aria-hidden="true"
        className={iconClassName}
        focusable={false}
      />
      {CONTACT_EMAIL}
    </a>
    <ul className="flex items-center gap-4">
      <li>
        <a
          aria-label={labels.telegram}
          className={linkClassName}
          href={CONTACT_TELEGRAM_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <TelegramIcon
            aria-hidden="true"
            className={iconClassName}
            focusable={false}
          />
        </a>
      </li>
      <li>
        <a
          aria-label={labels.linkedin}
          className={linkClassName}
          href={CONTACT_LINKEDIN_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkedinIcon
            aria-hidden="true"
            className={iconClassName}
            focusable={false}
          />
        </a>
      </li>
    </ul>
  </div>
);
