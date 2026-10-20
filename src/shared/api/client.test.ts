import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { createApiClient, unwrap } from "./client";
import { ApiError } from "./error";

afterEach(() => vi.unstubAllEnvs());

describe("createApiClient", () => {
  it("sends requests to the backend from API_URL", async () => {
    vi.stubEnv("API_URL", "http://backend.test");
    const fetchMock = vi.fn(async (_request: Request) => new Response("[]"));
    vi.stubGlobal("fetch", fetchMock);

    await createApiClient().GET("/cases");

    expect(fetchMock.mock.calls[0]?.[0].url).toBe("http://backend.test/cases");
    vi.unstubAllGlobals();
  });

  it("exposes only read operations", () => {
    vi.stubEnv("API_URL", "http://backend.test");

    const client = createApiClient();

    expect(Object.keys(client)).toEqual(["GET"]);
    expectTypeOf(client).toHaveProperty("GET");
    expectTypeOf(client).not.toHaveProperty("POST");
    expectTypeOf(client).not.toHaveProperty("PATCH");
    expectTypeOf(client).not.toHaveProperty("PUT");
    expectTypeOf(client).not.toHaveProperty("DELETE");
  });

  it.each(["", undefined])("names API_URL when it is %j", (value) => {
    vi.stubEnv("API_URL", value);

    expect(() => createApiClient()).toThrow("API_URL");
  });
});

describe("unwrap", () => {
  const response = new Response();

  it("returns the data of a successful result", () => {
    expect(unwrap({ data: ["a"], response })).toEqual(["a"]);
  });

  it("throws ApiError built from the error body of a failed result", () => {
    const failed = {
      error: { message: "Case not found" },
      response: new Response(null, { status: 404 }),
    };

    expect(() => unwrap(failed)).toThrow(ApiError);
    expect(() => unwrap(failed)).toThrow(
      expect.objectContaining({ status: 404, message: "Case not found" }),
    );
  });
});
