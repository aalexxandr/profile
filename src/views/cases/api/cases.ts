import { createApiClient, unwrap } from "@/shared/api";
import type { Locale } from "@/shared/i18n";

import type { CaseDetail, CaseListItem } from "./types";

export async function getCases(locale: Locale): Promise<CaseListItem[]> {
  return unwrap(
    await createApiClient().GET("/cases", {
      params: { query: { lang: locale } },
    }),
  );
}

export async function getCase(
  slug: string,
  locale: Locale,
): Promise<CaseDetail> {
  return unwrap(
    await createApiClient().GET("/cases/{slug}", {
      params: { path: { slug }, query: { lang: locale } },
    }),
  );
}
