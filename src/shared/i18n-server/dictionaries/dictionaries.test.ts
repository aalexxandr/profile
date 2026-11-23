import { describe, expect, it } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";

import { en } from "./en";
import { ru } from "./ru";

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const collectStrings = (value: unknown, path = ""): [string, string][] => {
  if (typeof value === "string") {
    return [[path, value]];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectStrings(item, `${path}[${index}]`),
    );
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      collectStrings(item, path ? `${path}.${key}` : key),
    );
  }

  return [];
};

describe.each(locales)("%s dictionary", (locale) => {
  const dictionary = dictionaries[locale];

  it("has no empty strings", () => {
    const emptyPaths = collectStrings(dictionary)
      .filter(([, text]) => text.trim() === "")
      .map(([path]) => path);

    expect(emptyPaths).toEqual([]);
  });

  it("has a label for every locale in the language switcher", () => {
    const { locales: switcherLocales } = dictionary.navigation.languageSwitcher;

    expect(Object.keys(switcherLocales).sort()).toEqual([...locales].sort());
  });
});

describe.each(locales)("%s case texts", (locale) => {
  const { detail, noImage } = dictionaries[locale].pages.cases;

  it("has a label for every case role", () => {
    expect(Object.keys(detail.roles).sort()).toEqual([
      "FRONTEND",
      "FULLSTACK",
      "PRODUCT",
    ]);
  });

  it("has the no-image text and the project facts labels", () => {
    expect(noImage).toBeTruthy();
    expect(detail.companyLabel).toBeTruthy();
    expect(detail.teamSizeLabel).toBeTruthy();
    expect(detail.periodLabel).toBeTruthy();
    expect(detail.periodPresent).toBeTruthy();
  });
});

describe.each(locales)("%s error page texts", (locale) => {
  const { notFound, serverError } = dictionaries[locale].errors;

  it("has the 404 page texts", () => {
    expect(notFound.metaTitle).toBeTruthy();
    expect(notFound.title).toBeTruthy();
    expect(notFound.description).toBeTruthy();
    expect(notFound.home).toBeTruthy();
  });

  it("has the error screen texts", () => {
    expect(serverError.title).toBeTruthy();
    expect(serverError.description).toBeTruthy();
    expect(serverError.retry).toBeTruthy();
    expect(serverError.home).toBeTruthy();
  });
});

describe("dictionaries together", () => {
  it("have the same structure of keys", () => {
    // Plural forms differ per language; only the `other` fallback is shared.
    const isSharedKey = (path: string) =>
      !path.includes("teamSizeUnit.") || path.endsWith("teamSizeUnit.other");
    const keysOf = (dictionary: Dictionary) =>
      collectStrings(dictionary)
        .map(([path]) => path)
        .filter(isSharedKey);
    const ruKeys = keysOf(ru);
    const enKeys = keysOf(en);

    expect(enKeys).toEqual(ruKeys);
  });

  it("list the same navigation pages in the same order", () => {
    expect(en.navigation.items.map(({ page }) => page)).toEqual(
      ru.navigation.items.map(({ page }) => page),
    );
  });

  it("provide metadata for every page", () => {
    expect(Object.keys(en.metadata).sort()).toEqual(
      Object.keys(ru.metadata).sort(),
    );
  });
});

describe("team size texts", () => {
  it("uses the short labels", () => {
    expect(ru.pages.cases.detail.teamSizeLabel).toBe("Команда");
    expect(en.pages.cases.detail.teamSizeLabel).toBe("Team");
  });

  it.each(locales)("has a non-empty fallback unit in %s", (locale) => {
    const { teamSizeUnit } = dictionaries[locale].pages.cases.detail;

    expect(teamSizeUnit.other.trim()).not.toBe("");
  });

  it("has every plural form Russian needs", () => {
    const { teamSizeUnit } = ru.pages.cases.detail;

    expect(teamSizeUnit.one).toBe("человек");
    expect(teamSizeUnit.few).toBe("человека");
    expect(teamSizeUnit.many).toBe("человек");
  });

  it("has the singular and the plural in English", () => {
    const { teamSizeUnit } = en.pages.cases.detail;

    expect(teamSizeUnit.one).toBe("person");
    expect(teamSizeUnit.other).toBe("people");
  });
});

describe.each(locales)("%s contacts page texts", (locale) => {
  const { form, illustrationAlt, infoText, links } =
    dictionaries[locale].pages.contacts;

  it("has the info text, the illustration alt and the social link labels", () => {
    expect(infoText).toBeTruthy();
    expect(illustrationAlt).toBeTruthy();
    expect(links.telegram).toBeTruthy();
    expect(links.linkedin).toBeTruthy();
  });

  it("has labels for the fields, the methods and the submit button", () => {
    expect(form.title).toBeTruthy();
    expect(form.nameLabel).toBeTruthy();
    expect(form.emailLabel).toBeTruthy();
    expect(form.methodLabel).toBeTruthy();
    expect(form.methods.telegram).toBeTruthy();
    expect(form.methods.email).toBeTruthy();
    expect(form.usernameLabel).toBeTruthy();
    expect(form.messageLabel).toBeTruthy();
    expect(form.send).toBeTruthy();
  });

  it("has the validation errors and the success notice", () => {
    expect(form.errors.required).toBeTruthy();
    expect(form.errors.invalidEmail).toBeTruthy();
    expect(form.errors.tooLong).toContain("{max}");
    expect(form.success.title).toBeTruthy();
    expect(form.success.text).toBeTruthy();
  });

  it("has no phone, WhatsApp or service texts", () => {
    const texts = collectStrings(dictionaries[locale].pages.contacts)
      .map(([, text]) => text.toLowerCase())
      .join(" ");

    expect(texts).not.toMatch(/whatsapp|телефон|phone|service|услуг/);
  });
});
