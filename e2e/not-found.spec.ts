import { en } from "../src/shared/i18n-server/dictionaries/en";
import { ru } from "../src/shared/i18n-server/dictionaries/ru";
import { expect, test } from "./support/test";

const cases = [
  { locale: "ru", dictionary: ru, path: "/ru/unknown-page" },
  { locale: "en", dictionary: en, path: "/en/unknown-page" },
  { locale: "ru", dictionary: ru, path: "/ru/cases/unknown" },
  { locale: "en", dictionary: en, path: "/en/cases/unknown" },
] as const;

for (const { locale, dictionary, path } of cases) {
  test.describe(`404 page at ${path}`, () => {
    const texts = dictionary.errors.notFound;

    test("answers 404 with the localized page inside the site layout", async ({
      page,
    }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(
        page.getByRole("heading", { level: 1, name: texts.title }),
      ).toBeVisible();
      await expect(page.getByText(texts.description)).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: dictionary.navigation.ariaLabel }),
      ).toBeVisible();
      await expect(page.getByText("This page could not be found")).toHaveCount(
        0,
      );
    });

    test("is not indexed and has a localized title", async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
      await expect(page).toHaveTitle(texts.metaTitle);
    });

    test("leads back to the home page of its locale", async ({ page }) => {
      await page.goto(path);
      await page.getByRole("link", { name: texts.home }).click();

      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    });
  });
}

test("a path the proxy moves under a locale ends on that locale's 404 page", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });

  const response = await page.goto("/de");

  expect(response?.status()).toBe(404);
  expect(new URL(page.url()).pathname).toBe("/en/de");
  await expect(
    page.getByRole("heading", { level: 1, name: en.errors.notFound.title }),
  ).toBeVisible();
});
