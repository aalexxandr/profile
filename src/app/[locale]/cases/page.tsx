import { CasesPage as CasesViewPage, getCases } from "@/views/cases";
import {
  createPageMetadata,
  getDictionary,
  getValidatedLocale,
} from "@/shared/i18n-server";

type CasesPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: CasesPageProps) => {
  const locale = await getValidatedLocale(params);

  return createPageMetadata("cases", locale);
};

export default async function CasesPage({ params }: CasesPageProps) {
  const locale = await getValidatedLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <CasesViewPage
      caseItems={await getCases(locale)}
      cases={dictionary.pages.cases}
      locale={locale}
    />
  );
}
