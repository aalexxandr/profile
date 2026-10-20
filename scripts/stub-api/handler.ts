import { defaultLocale, isLocale } from "@/shared/i18n/config";
import type { Schemas } from "@/shared/api/types";
import { getDetail, getListItems } from "./fixtures";

const json = (body: unknown, status = 200) => Response.json(body, { status });

const notFound = (path: string, message: string) =>
  json(
    {
      status: 404,
      message,
      timestamp: new Date().toISOString(),
      path,
    } satisfies Schemas["ErrorResponseDto"],
    404,
  );

// Mirrors the backend: an unsupported or missing `lang` serves Russian.
const getLocale = (url: URL) => {
  const lang = url.searchParams.get("lang");

  return lang && isLocale(lang) ? lang : defaultLocale;
};

export const handleRequest = (request: Request): Response => {
  const url = new URL(request.url);
  const locale = getLocale(url);

  if (request.method !== "GET") {
    return notFound(url.pathname, "Not found");
  }

  if (url.pathname === "/cases") {
    return json(getListItems(locale));
  }

  const slug = /^\/cases\/([^/]+)$/.exec(url.pathname)?.[1];

  if (slug) {
    const detail = getDetail(decodeURIComponent(slug), locale);

    return detail
      ? json(detail)
      : notFound(url.pathname, `Case "${slug}" was not found`);
  }

  return notFound(url.pathname, "Not found");
};
