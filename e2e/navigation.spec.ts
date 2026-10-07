import { expect, test } from "./support/test";

test("the menu navigates between pages and marks the current one", async ({
  page,
}) => {
  await page.goto("/ru");

  const menu = page.getByRole("navigation", { name: "Главная навигация" });

  await expect(menu.getByRole("link", { name: "главная" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await menu.getByRole("link", { name: "контакты" }).click();

  await expect(page).toHaveURL(/\/ru\/contacts$/);
  await expect(menu.getByRole("link", { name: "контакты" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(menu.getByRole("link", { name: "главная" })).not.toHaveAttribute(
    "aria-current",
    /.*/,
  );

  await menu.getByRole("link", { name: "кейсы" }).click();

  await expect(page).toHaveURL(/\/ru\/cases$/);
  await expect(menu.getByRole("link", { name: "кейсы" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("the home call to action leads to the cases", async ({ page }) => {
  await page.goto("/ru");

  await page.getByRole("link", { name: "Перейти к кейсам" }).click();

  await expect(page).toHaveURL(/\/ru\/cases$/);
});

test("the language switcher keeps the page and switches the locale", async ({
  page,
}) => {
  await page.goto("/ru/cases");

  const switcher = page.getByRole("navigation", { name: "Выбор языка" });

  await switcher.locator('a[href="/en/cases"]').click();

  await expect(page).toHaveURL(/\/en\/cases$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("navigation").nth(1).locator('a[href="/en/cases"]'),
  ).toHaveAttribute("aria-current", "true");

  await page
    .getByRole("navigation")
    .nth(1)
    .locator('a[href="/ru/cases"]')
    .click();

  await expect(page).toHaveURL(/\/ru\/cases$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});

test("the language switcher keeps a case details page", async ({ page }) => {
  await page.goto("/ru/cases/product-ui");

  await page
    .getByRole("navigation", { name: "Выбор языка" })
    .locator('a[href="/en/cases/product-ui"]')
    .click();

  await expect(page).toHaveURL(/\/en\/cases\/product-ui$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Product UI" }),
  ).toBeVisible();
});
