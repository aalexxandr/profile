import Image from "next/image";

import type { Dictionary } from "@/shared/i18n";

type ContactsInfoProps = {
  contacts: Dictionary["pages"]["contacts"];
};

export const ContactsInfo = ({ contacts }: ContactsInfoProps) => (
  <div className="flex flex-col gap-6 sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-8 lg:w-80 lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-start xl:w-89">
    <p className="ml-auto max-w-60 text-end font-vcr text-[12px]/4 whitespace-pre-line text-accent sm:ml-0 sm:max-w-72 sm:text-start sm:text-[14px]/5 lg:max-w-none">
      {contacts.infoText}
    </p>
    <Image
      alt={contacts.illustrationAlt}
      className="h-auto w-47.5 sm:w-72.5 lg:w-full"
      height={286}
      priority
      src="/bg-contacts-page.svg"
      width={355}
    />
  </div>
);
