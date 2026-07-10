import { CasesPage as CasesViewPage } from "@/views/cases";
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

  return <CasesViewPage cases={dictionary.pages.cases} />;
}
