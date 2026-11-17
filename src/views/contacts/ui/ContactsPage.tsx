import type { Dictionary } from "@/shared/i18n";
import { CursorGlow } from "@/shared/ui";

type ContactsPageProps = {
  contacts: Dictionary["pages"]["contacts"];
};

export const ContactsPage = ({ contacts }: ContactsPageProps) => (
  <div className="grid size-full min-h-0 place-items-center px-6 font-vcr text-[16px]/6 text-white uppercase">
    <CursorGlow />
    {contacts.title}
  </div>
);
