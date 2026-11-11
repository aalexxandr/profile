import { createApiClient, unwrap } from "@/shared/api";
import { getCaseList } from "@/shared/content";
import type { Locale } from "@/shared/i18n";

import type { CaseListItem } from "./types";

// Without `API_URL` the site runs on the static content (see `shared/content`).
export async function getCases(locale: Locale): Promise<CaseListItem[]> {
  if (!process.env.API_URL) {
    return getCaseList(locale);
  }

  return unwrap(
    await createApiClient().GET("/cases", {
      params: { query: { lang: locale } },
    }),
  );
}
