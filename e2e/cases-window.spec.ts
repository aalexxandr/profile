import type { Page } from "@playwright/test";

import { expect, test } from "./support/test";

test.describe("retro window on the cases page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ru/cases");
  });

  const getWindow = (page: Page) =>
    page.getByRole("region", { name: "Product UI" });

  const getContent = (page: Page) =>
    page.locator('section[aria-label="Product UI"] > div[aria-hidden]');

  test("can be collapsed and expanded with the keyboard", async ({ page }) => {
    const window = getWindow(page);

    await expect(getContent(page)).toHaveAttribute("aria-hidden", "false");

    await window.getByRole("button", { name: "Свернуть окно" }).focus();
    await page.keyboard.press("Enter");

    await expect(getContent(page)).toHaveAttribute("aria-hidden", "true");

    await window.getByRole("button", { name: "Развернуть окно" }).focus();
    await page.keyboard.press("Space");

    await expect(getContent(page)).toHaveAttribute("aria-hidden", "false");
  });

  test("keeps a logical tab order between the control buttons", async ({
    page,
  }) => {
    const window = getWindow(page);

    await window.getByRole("button", { name: "Свернуть окно" }).focus();
    await page.keyboard.press("Tab");
    await expect(
      window.getByRole("button", { name: "Развернуть окно" }),
    ).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(
      window.getByRole("button", { name: "Закрыть окно" }),
    ).toBeFocused();
  });

  test("plays the close animation and then settles", async ({ page }) => {
    await getWindow(page).getByRole("button", { name: "Закрыть окно" }).focus();
    await page.keyboard.press("Enter");

    await expect(getWindow(page)).toHaveClass(/animate-retro-zoom/);
    await expect(getWindow(page)).not.toHaveClass(/animate-retro-zoom/, {
      timeout: 5_000,
    });
  });
});

test.describe("case details", () => {
  test("opens from the list and returns back", async ({ page }) => {
    await page.goto("/ru/cases");

    await page.getByRole("link", { name: "Подробнее: Product UI" }).click();

    await expect(page).toHaveURL(/\/ru\/cases\/product-ui$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Product UI" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Назад к кейсам" }).click();

    await expect(page).toHaveURL(/\/ru\/cases$/);
  });
});
