"use client";

import { getLocalizedPath, type Dictionary, type Locale } from "@/shared/i18n";
import { Button } from "@/shared/ui";

import { useReportError } from "../lib/useReportError";
import { ErrorScreen } from "./ErrorScreen";

type PageErrorFallbackProps = {
  error: unknown;
  retry: () => void;
  locale: Locale;
  texts: Dictionary["errors"]["serverError"];
};

export const PageErrorFallback = ({
  error,
  retry,
  locale,
  texts,
}: PageErrorFallbackProps) => {
  useReportError(error);

  return (
    <ErrorScreen
      description={texts.description}
      title={texts.title}
      variant="serverError"
    >
      <div className="flex w-full flex-col gap-2.5">
        <Button onClick={retry}>{texts.retry}</Button>
        <Button href={getLocalizedPath("home", locale)}>{texts.home}</Button>
      </div>
    </ErrorScreen>
  );
};
