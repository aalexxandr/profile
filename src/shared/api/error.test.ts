import { describe, expect, it } from "vitest";

import { ApiError } from "./error";

describe("ApiError.from", () => {
  it("carries the status and the message of the backend error body", () => {
    const error = ApiError.from({ message: "Case not found" }, 404);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Case not found",
    });
  });

  it("joins a list of validation messages into one string", () => {
    const error = ApiError.from(
      { message: ["lang is invalid", "slug is bad"] },
      400,
    );

    expect(error).toMatchObject({
      status: 400,
      message: "lang is invalid; slug is bad",
    });
  });

  it.each([
    ["a text body", "<html>bad gateway</html>"],
    ["an empty body", undefined],
    ["a body without a message", { status: 502 }],
    ["a message of the wrong type", { message: 42 }],
  ])("falls back to the status for %s", (_name, body) => {
    const error = ApiError.from(body, 502);

    expect(error).toMatchObject({
      status: 502,
      message: "Request failed with status 502",
    });
  });
});
