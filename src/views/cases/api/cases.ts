import { createApiClient, unwrap } from "@/shared/api";
import type { Locale } from "@/shared/i18n";

import type { CaseListItem } from "./types";

export async function getCases(locale: Locale): Promise<CaseListItem[]> {
  return unwrap(
    await createApiClient().GET("/cases", {
      params: { query: { lang: locale } },
    }),
  );
}
