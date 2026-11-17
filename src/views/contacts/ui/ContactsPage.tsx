import type { Dictionary } from "@/shared/i18n";
import { CursorGlow, Reveal } from "@/shared/ui";

import { ContactForm } from "./ContactForm";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsInfo } from "./ContactsInfo";

type ContactsPageProps = {
  contacts: Dictionary["pages"]["contacts"];
};

export const ContactsPage = ({ contacts }: ContactsPageProps) => (
  <div className="size-full min-h-0 overflow-y-auto px-4 pb-12 sm:px-6">
    <CursorGlow />
    <div className="mx-auto flex w-full max-w-310 flex-col gap-10 lg:gap-16">
      <ContactsHeader contacts={contacts} />
      <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-20">
        <Reveal delay={160} direction="up">
          <ContactsInfo contacts={contacts} />
        </Reveal>
        <Reveal
          className="min-w-0 flex-1"
          delay={260}
          direction="up"
          trigger="visible"
        >
          <ContactForm form={contacts.form} />
        </Reveal>
      </div>
    </div>
  </div>
);
