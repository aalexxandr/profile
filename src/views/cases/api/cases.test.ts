import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";

import { getCases } from "./cases";
import type { CaseListItem } from "./types";

const API_URL = "http://backend.test";

const listItem: CaseListItem = {
  slug: "spectre",
  locale: "ru",
  name: "The Spectre Explorer",
  category: "FinTech / Web App",
  stack: ["React"],
  shortDescription: "Short",
  image: null,
  blurImage: null,
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const fetchMock = vi.fn<(request: Request) => Promise<Response>>();

beforeEach(() => {
  vi.stubEnv("API_URL", API_URL);
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const lastRequest = (): Request => {
  const request = fetchMock.mock.calls[0]?.[0];

  if (!request) {
    throw new Error("fetch was not called");
  }

  return request;
};

describe("getCases", () => {
  it.each(locales)("requests the list with lang=%s", async (locale) => {
    fetchMock.mockResolvedValue(jsonResponse([listItem]));

    const result = await getCases(locale);

    const url = new URL(lastRequest().url);
    expect(lastRequest().method).toBe("GET");
    expect(url.origin + url.pathname).toBe(`${API_URL}/cases`);
    expect(url.searchParams.get("lang")).toBe(locale);
    expect(result).toEqual([listItem]);
  });

  it("returns an empty list when there are no cases", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await expect(getCases("en")).resolves.toEqual([]);
  });

  it("does not send credentials", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await getCases("ru");

    expect(lastRequest().headers.has("Authorization")).toBe(false);
  });

  it("raises ApiError when the backend answers with an error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ status: 400, message: ["lang is invalid"] }, 400),
    );

    await expect(getCases("ru")).rejects.toThrow(
      expect.objectContaining({ status: 400, message: "lang is invalid" }),
    );
  });

  it("names API_URL and sends no request when it is missing", async () => {
    vi.stubEnv("API_URL", "");

    await expect(getCases("ru")).rejects.toThrow("API_URL");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
