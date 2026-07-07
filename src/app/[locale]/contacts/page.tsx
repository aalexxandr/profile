import {
  createPageMetadata,
  getDictionary,
  getValidatedLocale,
} from "@/shared/i18n-server";

type ContactsPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: ContactsPageProps) => {
  const locale = await getValidatedLocale(params);

  return createPageMetadata("contacts", locale);
};

export default async function ContactsPage({ params }: ContactsPageProps) {
  const locale = await getValidatedLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <div className="grid size-full min-h-0 place-items-center px-6 font-vcr text-[16px]/6 text-white uppercase">
      {dictionary.pages.contacts.title}
    </div>
  );
}
