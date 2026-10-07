import { describe, expect, it } from "vitest";

import { isLocale } from "@/shared/i18n";

describe("isLocale", () => {
  it.each(["ru", "en"])("accepts supported locale %s", (value) => {
    expect(isLocale(value)).toBe(true);
  });

  it.each(["RU", "", "de", "ru-RU"])("rejects %j", (value) => {
    expect(isLocale(value)).toBe(false);
  });
});
