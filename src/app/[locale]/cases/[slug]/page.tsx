import { notFound } from "next/navigation";

import {
  CaseDetailPage,
  createCaseMetadata,
  getMockCase,
  getMockCaseItems,
} from "@/views/cases";
import { locales } from "@/shared/i18n";
import { getDictionary, getValidatedLocale } from "@/shared/i18n-server";

type CasePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export const generateStaticParams = () =>
  locales.flatMap((locale) =>
    getMockCaseItems(locale).map(({ slug }) => ({ locale, slug })),
  );

const getCaseOrNotFound = async (params: CasePageProps["params"]) => {
  const locale = await getValidatedLocale(params);
  const { slug } = await params;
  const caseItem = getMockCase(locale, slug);

  if (!caseItem) {
    notFound();
  }

  return { caseItem, locale };
};

export const generateMetadata = async ({ params }: CasePageProps) => {
  const { caseItem, locale } = await getCaseOrNotFound(params);

  return createCaseMetadata(caseItem, locale);
};

export default async function CasePage({ params }: CasePageProps) {
  const { caseItem, locale } = await getCaseOrNotFound(params);
  const dictionary = await getDictionary(locale);

  return (
    <CaseDetailPage
      caseItem={caseItem}
      cases={dictionary.pages.cases}
      locale={locale}
    />
  );
}
