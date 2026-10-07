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

  it("has a form for every plural category of the locale", () => {
    const categories = new Intl.PluralRules(locale).resolvedOptions()
      .pluralCategories;
    const { objects } = dictionary.pages.cases.status;

    for (const category of categories) {
      expect(objects[category], `objects.${category}`).toBeTruthy();
    }
  });

  it("has a label for every locale in the language switcher", () => {
    const { locales: switcherLocales } = dictionary.navigation.languageSwitcher;

    expect(Object.keys(switcherLocales).sort()).toEqual([...locales].sort());
  });
});

describe("dictionaries together", () => {
  it("have the same structure of keys", () => {
    const keysOf = (dictionary: Dictionary) =>
      collectStrings(dictionary).map(([path]) => path);
    const ruKeys = keysOf(ru).filter(
      (path) => !path.includes("status.objects"),
    );
    const enKeys = keysOf(en).filter(
      (path) => !path.includes("status.objects"),
    );

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
