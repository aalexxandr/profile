import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRouteLocale } from "./useRouteLocale";

const { useParams } = vi.hoisted(() => ({ useParams: vi.fn() }));

vi.mock("next/navigation", () => ({ useParams }));

beforeEach(() => {
  useParams.mockReset();
});

describe("useRouteLocale", () => {
  it.each(["ru", "en"])("returns the %s locale of the route", (locale) => {
    useParams.mockReturnValue({ locale, rest: ["unknown-page"] });

    expect(renderHook(() => useRouteLocale()).result.current).toBe(locale);
  });

  it.each([
    ["no locale param", {}],
    ["an unsupported locale", { locale: "de" }],
    ["no params at all", null],
  ])("falls back to the default locale for %s", (_name, params) => {
    useParams.mockReturnValue(params);

    expect(renderHook(() => useRouteLocale()).result.current).toBe("ru");
  });
});
