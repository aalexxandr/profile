import { describe, expect, it } from "vitest";

import { locales } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { getFieldErrorText } from "./getFieldErrorText";

const errorsByLocale = {
  en: en.pages.contacts.form.errors,
  ru: ru.pages.contacts.form.errors,
};

describe("getFieldErrorText", () => {
  it.each(locales)("returns the localized texts in %s", (locale) => {
    const errors = errorsByLocale[locale];

    expect(getFieldErrorText("required", errors, "name")).toBe(errors.required);
    expect(getFieldErrorText("invalidEmail", errors, "email")).toBe(
      errors.invalidEmail,
    );
  });

  it("puts the limit of the field into the too long text", () => {
    const errors = errorsByLocale.en;

    expect(getFieldErrorText("tooLong", errors, "message")).toBe(
      "No more than 1000 characters",
    );
    expect(getFieldErrorText("tooLong", errors, "name")).toBe(
      "No more than 100 characters",
    );
  });

  it("returns undefined without an error", () => {
    expect(
      getFieldErrorText(undefined, errorsByLocale.en, "name"),
    ).toBeUndefined();
  });

  it("accepts the error message of a field as it comes from the form", () => {
    expect(getFieldErrorText("required", errorsByLocale.en, "name")).toBe(
      errorsByLocale.en.required,
    );
  });

  it("ignores a message that is not an error code", () => {
    expect(
      getFieldErrorText("Something else", errorsByLocale.en, "name"),
    ).toBeUndefined();
  });
});
