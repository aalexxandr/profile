"use client";

import { getLocalizedPath, type Locale } from "@/shared/i18n";
import { Button } from "@/shared/ui";

import type { NotFoundTexts } from "../api/getNotFoundTexts";
import { useRouteLocale } from "../lib/useRouteLocale";
import { ErrorScreen } from "./ErrorScreen";

type NotFoundPageProps = {
  textsByLocale: Record<Locale, NotFoundTexts>;
};

export const NotFoundPage = ({ textsByLocale }: NotFoundPageProps) => {
  const locale = useRouteLocale();
  const texts = textsByLocale[locale];

  return (
    <ErrorScreen
      description={texts.description}
      title={texts.title}
      variant="notFound"
    >
      <title>{texts.metaTitle}</title>
      <Button href={getLocalizedPath("home", locale)}>{texts.home}</Button>
    </ErrorScreen>
  );
};
