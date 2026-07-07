import { HomePage } from "@/views/home";
import { getLocalizedPath } from "@/shared/i18n";
import {
  createPageMetadata,
  getDictionary,
  getValidatedLocale,
} from "@/shared/i18n-server";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: LocalePageProps) => {
  const locale = await getValidatedLocale(params);

  return createPageMetadata("home", locale);
};

export default async function Home({ params }: LocalePageProps) {
  const locale = await getValidatedLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <HomePage
      ctaHref={getLocalizedPath("cases", locale)}
      home={dictionary.home}
    />
  );
}
