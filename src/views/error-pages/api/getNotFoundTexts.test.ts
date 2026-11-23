import { describe, expect, it } from "vitest";

import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { getNotFoundTexts } from "./getNotFoundTexts";

describe("getNotFoundTexts", () => {
  it("returns the 404 texts of every locale and nothing else", async () => {
    expect(await getNotFoundTexts()).toEqual({
      ru: ru.errors.notFound,
      en: en.errors.notFound,
    });
  });
});
