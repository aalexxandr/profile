import type { Dictionary } from "@/shared/i18n";
import { Reveal } from "@/shared/ui";

import { ContactLinks } from "./ContactLinks";

type ContactsHeaderProps = {
  contacts: Dictionary["pages"]["contacts"];
};

export const ContactsHeader = ({ contacts }: ContactsHeaderProps) => (
  <header className="flex flex-col gap-4 pt-8 md:gap-6 md:pt-12 lg:flex-row lg:items-center lg:justify-between">
    <Reveal direction="down">
      <h1 className="font-vcr text-[32px]/10 text-white uppercase md:text-[48px]/14">
        {contacts.title}
      </h1>
    </Reveal>
    <Reveal delay={120} direction="fade">
      <ContactLinks labels={contacts.links} />
    </Reveal>
  </header>
);
