import "../globals.css";

import { SiteLayout } from "../_layout/SiteLayout";
import { locales } from "@/shared/i18n";
import { getDictionary, getValidatedLocale } from "@/shared/i18n-server";

export const dynamicParams = false;

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await getValidatedLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <SiteLayout dictionary={dictionary} locale={locale}>
      {children}
    </SiteLayout>
  );
}
