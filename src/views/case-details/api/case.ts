import { cache } from "react";

import { ApiError, createApiClient, unwrap } from "@/shared/api";
import { findCase } from "@/shared/content";
import type { Locale } from "@/shared/i18n";

import type { CaseDetail } from "./types";

// Without `API_URL` the site runs on the static content (see `shared/content`);
// an unknown slug raises the same 404 `ApiError` the backend does.
const getStaticCase = (slug: string, locale: Locale): CaseDetail => {
  const found = findCase(slug, locale);

  if (!found) {
    throw new ApiError(404, "Case not found");
  }

  return found;
};

// Cached so `generateMetadata` and the page share one request per render.
export const getCase = cache(
  async (slug: string, locale: Locale): Promise<CaseDetail> => {
    if (!process.env.API_URL) {
      return getStaticCase(slug, locale);
    }

    return unwrap(
      await createApiClient().GET("/cases/{slug}", {
        params: { path: { slug }, query: { lang: locale } },
      }),
    );
  },
);
