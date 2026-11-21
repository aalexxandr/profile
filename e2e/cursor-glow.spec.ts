import type { Locator, Page } from "@playwright/test";

import { locales } from "./support/routes";
import { expect, test } from "./support/test";

const glowOf = (page: Page) => page.getByTestId("cursor-glow");

const centreOf = async (locator: Locator) => {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error("the glow has no box");
  }

  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

// Hue (0-360) of the first colour in a computed CSS value. Chrome
// serialises mixed colours as `color(srgb r g b / a)` with 0-1 channels.
const hueOf = (value: string) => {
  const match =
    /(rgba?\(|color\(srgb)\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(value);

  if (!match) {
    throw new Error(`no colour in "${value}"`);
  }

  const scale = match[1] === "color(srgb" ? 1 : 255;
  const red = Number(match[2]) / scale;
  const green = Number(match[3]) / scale;
  const blue = Number(match[4]) / scale;
  const max = Math.max(red, green, blue);
  const delta = max - Math.min(red, green, blue);

  if (delta === 0) {
    return 0;
  }

  const sector =
    max === red
      ? ((green - blue) / delta) % 6
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;

  return (sector * 60 + 360) % 360;
};

const scrollPageContent = (page: Page, delta: number) =>
  page.evaluate((by) => {
    const container = [...document.querySelectorAll("main *")].find(
      (candidate) =>
        ["auto", "scroll"].includes(getComputedStyle(candidate).overflowY) &&
        candidate.scrollHeight > candidate.clientHeight,
    );

    // The page scrolls inside its container when that is shorter than the
    // content, otherwise the window scrolls.
    (container ?? window).scrollBy(0, by);
  }, delta);

test.describe("cursor glow with a mouse", () => {
  test.skip(({ isMobile }) => isMobile, "needs a hovering fine pointer");

  for (const locale of locales) {
    for (const suffix of ["/cases", "/contacts"]) {
      test(`follows the mouse on /${locale}${suffix}`, async ({ page }) => {
        await page.goto(`/${locale}${suffix}`);
        const glow = glowOf(page);

        await expect(glow).toHaveCount(1);
        await page.mouse.move(900, 500);
        await expect
          .poll(() => centreOf(glow), { timeout: 5_000 })
          .toEqual({ x: 900, y: 500 });

        await page.mouse.move(200, 150);
        await expect
          .poll(() => centreOf(glow), { timeout: 5_000 })
          .toEqual({ x: 200, y: 150 });
      });
    }
  }

  test("has the hue of the site's purple accent", async ({ page }) => {
    await page.goto("/en/cases/spectre");
    await expect(glowOf(page)).toHaveCount(1);

    const backLink = page.getByRole("link", { name: /back to cases/i });
    const accent = await backLink.evaluate(
      (link) => getComputedStyle(link).color,
    );
    const glow = await glowOf(page).evaluate(
      (element) => getComputedStyle(element).backgroundImage,
    );

    expect(Math.abs(hueOf(glow) - hueOf(accent))).toBeLessThan(5);
  });

  test("does not block clicks and is hidden from assistive technology", async ({
    page,
  }) => {
    await page.goto("/en/contacts");

    await expect(glowOf(page)).toHaveCount(1);
    await expect(glowOf(page).locator("xpath=..")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(glowOf(page).locator("xpath=..")).toHaveCSS(
      "pointer-events",
      "none",
    );
  });

  for (const locale of locales) {
    test(`reaches the mouse over the case header on /${locale}/cases/spectre`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);
      const glow = glowOf(page);
      const title = page.getByRole("heading", { level: 1 });

      await expect(glow).toHaveCount(1);
      const target = await centreOf(title);
      await page.mouse.move(target.x, target.y);

      await expect
        .poll(
          async () => {
            const centre = await centreOf(glow);

            return Math.hypot(centre.x - target.x, centre.y - target.y);
          },
          { timeout: 5_000 },
        )
        .toBeLessThan(1);
      await expect(glow.locator("xpath=..")).toHaveCSS("mask-image", "none");
    });
  }

  test("reaches the top of the viewport after the case page is scrolled", async ({
    page,
  }) => {
    await page.goto("/en/cases/spectre");
    const glow = glowOf(page);

    await expect(glow).toHaveCount(1);
    await scrollPageContent(page, 150);
    await page.mouse.move(600, 20);
    await expect
      .poll(() => centreOf(glow), { timeout: 5_000 })
      .toEqual({ x: 600, y: 20 });
  });

  test("is not on the home page", async ({ page }) => {
    await page.goto("/en");
    await page.mouse.move(300, 300);

    await expect(glowOf(page)).toHaveCount(0);
  });

  test("is removed when leaving for the home page", async ({ page }) => {
    await page.goto("/en/contacts");
    await expect(glowOf(page)).toHaveCount(1);

    await page.goto("/en");

    await expect(glowOf(page)).toHaveCount(0);
  });
});

test.describe("cursor glow without a hovering mouse", () => {
  test("is not rendered on a touch device", async ({ isMobile, page }) => {
    test.skip(!isMobile, "mobile project only");

    for (const path of ["/en/cases", "/en/cases/spectre", "/en/contacts"]) {
      await page.goto(path);
      await expect(glowOf(page)).toHaveCount(0);
    }
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("is not rendered", async ({ isMobile, page }) => {
      test.skip(isMobile, "desktop project only");

      for (const path of ["/en/cases", "/en/cases/spectre", "/ru/contacts"]) {
        await page.goto(path);
        await page.mouse.move(300, 300);
        await expect(glowOf(page)).toHaveCount(0);
      }
    });
  });
});
