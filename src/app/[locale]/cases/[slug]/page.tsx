import { notFound } from "next/navigation";

import { ApiError } from "@/shared/api";
import {
  CaseDetailPage,
  createCaseMetadata,
  getCase,
} from "@/views/case-details";
import { getCases } from "@/views/cases";
import { locales } from "@/shared/i18n";
import { getDictionary, getValidatedLocale } from "@/shared/i18n-server";

type CasePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export const generateStaticParams = async () =>
  (
    await Promise.all(
      locales.map(async (locale) =>
        (await getCases(locale)).map(({ slug }) => ({ locale, slug })),
      ),
    )
  ).flat();

const getCaseOrNotFound = async (params: CasePageProps["params"]) => {
  const locale = await getValidatedLocale(params);
  const { slug } = await params;

  try {
    return { caseItem: await getCase(slug, locale), locale };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
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
