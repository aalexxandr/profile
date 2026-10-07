import { describe, expect, it } from "vitest";

import { getLanguageHref, isItemActive } from "./navigation-paths";

describe("getLanguageHref", () => {
  it.each([
    ["/ru", "en", "/en"],
    ["/en", "ru", "/ru"],
    ["/ru/cases", "en", "/en/cases"],
    ["/en/contacts", "ru", "/ru/contacts"],
    ["/ru/cases/product-ui", "en", "/en/cases/product-ui"],
    ["/", "en", "/en"],
  ] as const)("%s → %s gives %s", (pathname, locale, expected) => {
    expect(getLanguageHref(pathname, locale)).toBe(expected);
  });
});

describe("isItemActive", () => {
  it("matches the home page only by exact path", () => {
    expect(isItemActive("/ru", "/ru")).toBe(true);
    expect(isItemActive("/ru/cases", "/ru")).toBe(false);
    expect(isItemActive("/en/cases", "/en")).toBe(false);
  });

  it("matches a section by exact path and by nested paths", () => {
    expect(isItemActive("/ru/cases", "/ru/cases")).toBe(true);
    expect(isItemActive("/ru/cases/product-ui", "/ru/cases")).toBe(true);
  });

  it("does not match a path that only shares a prefix", () => {
    expect(isItemActive("/ru/cases-foo", "/ru/cases")).toBe(false);
  });

  it("does not match another locale or section", () => {
    expect(isItemActive("/en/cases", "/ru/cases")).toBe(false);
    expect(isItemActive("/ru/contacts", "/ru/cases")).toBe(false);
  });
});
