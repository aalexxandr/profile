"use client";

import { catchError, type ErrorInfo } from "next/error";

import type { Dictionary, Locale } from "@/shared/i18n";

import { PageErrorFallback } from "./PageErrorFallback";

type PageErrorBoundaryProps = {
  locale: Locale;
  texts: Dictionary["errors"]["serverError"];
};

// Wraps the page in the locale layout: a render error replaces only the page
// content, the site menu stays. `catchError` lets `notFound()`/`redirect()`
// through, and `retry()` re-fetches the Server Component payload.
export const PageErrorBoundary = catchError(
  ({ locale, texts }: PageErrorBoundaryProps, { error, retry }: ErrorInfo) => (
    <PageErrorFallback
      error={error}
      locale={locale}
      retry={retry}
      texts={texts}
    />
  ),
);
