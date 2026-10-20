import { cache } from "react";

import { createApiClient, unwrap } from "@/shared/api";
import type { Locale } from "@/shared/i18n";

import type { CaseDetail } from "./types";

// Cached so `generateMetadata` and the page share one request per render.
export const getCase = cache(
  async (slug: string, locale: Locale): Promise<CaseDetail> =>
    unwrap(
      await createApiClient().GET("/cases/{slug}", {
        params: { path: { slug }, query: { lang: locale } },
      }),
    ),
);
