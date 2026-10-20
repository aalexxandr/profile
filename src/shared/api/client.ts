import "server-only";

import createClient from "openapi-fetch";

import { ApiError } from "./error";
import type { paths } from "./generated/schema";

// Created per call so the base URL is read when the request is made and
// Next.js keeps control over `fetch` caching.
export const createApiClient = () => {
  const baseUrl = process.env.API_URL;

  if (!baseUrl) {
    throw new Error("API_URL is required to reach the backend");
  }

  // The site only reads: hand out `GET` alone so writes cannot be called.
  const { GET } = createClient<paths>({ baseUrl });

  return { GET };
};

type Result = { data?: unknown; error?: unknown; response: Response };

// The data of the successful branch of an openapi-fetch result.
type DataOf<R extends Result> = R extends { error?: never; data: infer Data }
  ? Data
  : never;

// openapi-fetch returns either `data` or `error`. When there is no error the
// data is present, which the generic result type cannot express by itself.
export const unwrap = <R extends Result>(result: R): DataOf<R> => {
  if (result.error !== undefined) {
    throw ApiError.from(result.error, result.response.status);
  }

  return result.data as DataOf<R>;
};
