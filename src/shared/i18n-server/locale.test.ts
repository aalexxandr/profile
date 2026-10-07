import { describe, expect, it, vi } from "vitest";

import { getValidatedLocale } from "./locale";

const { notFound } = vi.hoisted(() => ({
  // The real notFound() throws, so execution never continues after it.
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

vi.mock("next/navigation", () => ({ notFound }));

describe("getValidatedLocale", () => {
  it.each(["ru", "en"])("returns the %s locale from params", async (locale) => {
    await expect(getValidatedLocale(Promise.resolve({ locale }))).resolves.toBe(
      locale,
    );
    expect(notFound).not.toHaveBeenCalled();
  });

  it.each(["de", "RU", "", "ru-RU"])(
    "calls notFound() for the unsupported locale %j",
    async (locale) => {
      await expect(
        getValidatedLocale(Promise.resolve({ locale })),
      ).rejects.toThrow("404");
      expect(notFound).toHaveBeenCalledTimes(1);

      notFound.mockClear();
    },
  );
});
