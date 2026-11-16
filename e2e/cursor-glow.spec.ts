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

const bottomOf = async (locator: Locator) => {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error("the element has no box");
  }

  return box.y + box.height;
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

  test("is cut at the case header edge and follows it when the page scrolls", async ({
    page,
  }) => {
    await page.goto("/en/cases/spectre");
    const glow = glowOf(page);
    const layer = glow.locator("xpath=..");
    const header = page.locator("#case-header");

    await expect(glow).toHaveCount(1);
    await page.mouse.move(600, 40);

    const edge = async () => Math.round(await bottomOf(header));
    const centreAboveEdge = async () =>
      (await centreOf(glow)).y - (await edge());
    const maskOf = () =>
      layer.evaluate((element) =>
        (element as HTMLElement).style.getPropertyValue("mask-image"),
      );

    // Over the header the glow rests on the header's bottom edge...
    await expect.poll(centreAboveEdge, { timeout: 5_000 }).toBeCloseTo(0, 0);
    // ...and everything above that edge is masked out.
    await expect.poll(async () => maskOf()).toContain(`${await edge()}px`);

    const before = await edge();

    await scrollPageContent(page, 150);
    await expect.poll(edge).toBeLessThan(before);
    await expect.poll(centreAboveEdge, { timeout: 5_000 }).toBeCloseTo(0, 0);
    await expect.poll(async () => maskOf()).toContain(`${await edge()}px`);
  });

  test("reaches the About case block on the first screen", async ({ page }) => {
    await page.goto("/en/cases/spectre");
    const glow = glowOf(page);
    const header = page.locator("#case-header");
    const about = page.getByRole("heading", { name: "About case" });

    await expect(glow).toHaveCount(1);
    const aboutBox = await about.boundingBox();
    const headerEdge = await bottomOf(header);

    if (!aboutBox) {
      throw new Error("the About case heading has no box");
    }

    const pointerY = aboutBox.y + aboutBox.height / 2;

    expect(pointerY).toBeGreaterThan(headerEdge);
    await page.mouse.move(600, pointerY);
    // The glow centre goes all the way to the pointer over the block (it was
    // held far below, off the first screen, before).
    await expect
      .poll(async () => Math.abs((await centreOf(glow)).y - pointerY), {
        timeout: 5_000,
      })
      .toBeLessThan(1);
  });

  test("follows the mouse below the case header", async ({ page }) => {
    await page.goto("/en/cases/spectre");
    const glow = glowOf(page);
    const viewportHeight = page.viewportSize()?.height ?? 0;

    await expect(glow).toHaveCount(1);
    await scrollPageContent(page, 200);
    await page.mouse.move(600, viewportHeight - 10);
    await expect
      .poll(() => centreOf(glow), { timeout: 5_000 })
      .toEqual({ x: 600, y: viewportHeight - 10 });
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
