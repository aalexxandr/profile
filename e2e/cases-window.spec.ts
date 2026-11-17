import type { Page } from "@playwright/test";

import { expect, test } from "./support/test";

test.describe("retro window on the cases page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ru/cases");
  });

  const getWindow = (page: Page) =>
    page.getByRole("region", { name: "Spectre Explorer" });

  const getContent = (page: Page) =>
    page.locator('section[aria-label="Spectre Explorer"] > div[aria-hidden]');

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

const minimizeLabels = {
  en: "Minimize window",
  ru: "Свернуть окно",
} as const;

test.describe("collapsing a case window", () => {
  for (const locale of ["ru", "en"] as const) {
    test.describe(`on /${locale}/cases`, () => {
      const open = async (page: Page) => {
        await page.goto(`/${locale}/cases`);

        const block = page.locator("article").first();
        const minimize = page
          .getByRole("region", { name: "Spectre Explorer" })
          .getByRole("button", { name: minimizeLabels[locale] });

        // The entrance animation moves the block; measure after it settles.
        await block.evaluate((element) =>
          Promise.all(
            element.getAnimations({ subtree: true }).map((a) => a.finished),
          ),
        );

        return { block, minimize };
      };

      test("keeps the title bar in place on a wide screen", async ({
        isMobile,
        page,
      }) => {
        test.skip(
          isMobile,
          "the picture and the window are in one row only on wide screens",
        );

        const { block, minimize } = await open(page);
        const barBefore = await minimize.boundingBox();
        const blockBefore = await block.boundingBox();

        await minimize.click();
        await expect(
          page.locator(
            'section[aria-label="Spectre Explorer"] > div[aria-hidden]',
          ),
        ).toHaveAttribute("aria-hidden", "true");
        await page.waitForTimeout(500);

        expect((await minimize.boundingBox())?.y).toBeCloseTo(barBefore!.y, 0);
        expect((await block.boundingBox())?.height).toBeCloseTo(
          blockBefore!.height,
          0,
        );
      });

      test("releases the space on a narrow screen", async ({
        isMobile,
        page,
      }) => {
        test.skip(!isMobile, "the layout is a column only on narrow screens");

        const { block, minimize } = await open(page);
        const blockBefore = await block.boundingBox();

        await minimize.click();

        await expect
          .poll(async () => (await block.boundingBox())?.height)
          .toBeLessThan(blockBefore!.height - 20);
      });
    });
  }
});

test.describe("case details", () => {
  test("opens from the list and returns back", async ({ page }) => {
    await page.goto("/ru/cases");

    await page
      .getByRole("link", { name: "Подробнее: Spectre Explorer" })
      .click();

    await expect(page).toHaveURL(/\/ru\/cases\/spectre$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Назад к кейсам" }).click();

    await expect(page).toHaveURL(/\/ru\/cases$/);
  });
});
