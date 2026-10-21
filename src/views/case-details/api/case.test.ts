import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";
import { locales } from "@/shared/i18n";

import { getCase } from "./case";
import type { CaseDetail } from "./types";

// The test environment is not a server render, where `cache` would memoize
// per request: emulate that so the wiring can be asserted.
const memo = vi.hoisted(() => new Map<string, unknown>());

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  cache: <Args extends unknown[], Result>(
    fn: (...args: Args) => Result,
  ): ((...args: Args) => Result) => {
    return (...args) => {
      const key = JSON.stringify(args);

      if (!memo.has(key)) {
        memo.set(key, fn(...args));
      }

      return memo.get(key) as Result;
    };
  },
}));

const API_URL = "http://backend.test";

const detail: CaseDetail = {
  slug: "spectre",
  locale: "ru",
  name: "The Spectre Explorer",
  category: "FinTech / Web App",
  stack: ["React"],
  shortDescription: "Short",
  image: null,
  blurImage: null,
  backgroundImage: null,
  backgroundBlurImage: null,
  description: "Full",
  role: "FRONTEND",
  projectLink: "https://thespectre.io",
  company: null,
  teamSize: null,
  startedAt: "2024-01-01",
  endedAt: null,
  achievements: [],
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
  memo.clear();
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

describe("getCase", () => {
  it.each(locales)("requests the case with lang=%s", async (locale) => {
    fetchMock.mockResolvedValue(jsonResponse(detail));

    const result = await getCase("spectre", locale);

    const url = new URL(lastRequest().url);
    expect(lastRequest().method).toBe("GET");
    expect(url.origin + url.pathname).toBe(`${API_URL}/cases/spectre`);
    expect(url.searchParams.get("lang")).toBe(locale);
    expect(result).toEqual(detail);
  });

  it("encodes the slug in the path", async () => {
    fetchMock.mockResolvedValue(jsonResponse(detail));

    await getCase("a/b", "ru");

    expect(new URL(lastRequest().url).pathname).toBe("/cases/a%2Fb");
  });

  it("does not send credentials", async () => {
    fetchMock.mockResolvedValue(jsonResponse(detail));

    await getCase("spectre", "ru");

    expect(lastRequest().headers.has("Authorization")).toBe(false);
  });

  it("raises ApiError with the status and message of a 404", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ status: 404, message: "Case not found" }, 404),
    );

    const error = await getCase("unknown", "ru").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: "Case not found" });
  });

  it("sends one request when the same case is read twice in a render", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(detail));

    await Promise.all([getCase("memo", "en"), getCase("memo", "en")]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
