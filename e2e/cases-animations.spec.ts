import type { Locator, Page } from "@playwright/test";

import { locales } from "./support/routes";
import { expect, test } from "./support/test";

const opacityOf = (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).opacity);

const playStateOf = (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).animationPlayState);

const expectFullyShown = async (locator: Locator) => {
  await expect.poll(() => opacityOf(locator)).toBe("1");
};

const isBelowFirstScreen = (page: Page, locator: Locator) =>
  locator.evaluate(
    (element, viewportHeight) =>
      element.getBoundingClientRect().top > viewportHeight,
    page.viewportSize()?.height ?? 0,
  );

// The two animated wrappers of a case block: the picture and the window.
const revealsOf = (block: Locator) => block.locator(":scope > div");

// Scrolls the page (its own scroll container first, then the window) so the
// top of the element sits `visiblePx` above the bottom of the viewport.
const scrollTopEdgeIntoView = (locator: Locator, visiblePx: number) =>
  locator.evaluate((element, visible) => {
    const delta =
      element.getBoundingClientRect().top - (window.innerHeight - visible);
    const container = [...document.querySelectorAll("main *")].find(
      (candidate) =>
        ["auto", "scroll"].includes(getComputedStyle(candidate).overflowY) &&
        candidate.scrollHeight > candidate.clientHeight,
    );

    if (container) {
      container.scrollBy(0, delta);
    }

    const rest =
      element.getBoundingClientRect().top - (window.innerHeight - visible);
    window.scrollBy(0, rest);
  }, visiblePx);

// Lets the browser run layout and IntersectionObserver callbacks; used to
// assert that something does NOT happen.
const settleFrames = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let frames = 0;
        const tick = () =>
          (frames += 1) < 6 ? requestAnimationFrame(tick) : resolve();
        requestAnimationFrame(tick);
      }),
  );

for (const locale of locales) {
  test.describe(`cases list animations in ${locale}`, () => {
    test("the first block animates in on load", async ({
      consoleErrors,
      page,
    }) => {
      await page.goto(`/${locale}/cases`);
      const reveals = revealsOf(page.getByRole("article").first());

      await expect(reveals).toHaveCount(2);
      for (const reveal of await reveals.all()) {
        await expectFullyShown(reveal);
      }
      expect(consoleErrors).toEqual([]);
    });

    test("a block below the first screen waits until it is scrolled into view", async ({
      consoleErrors,
      page,
    }) => {
      await page.goto(`/${locale}/cases`);
      const lastBlock = page.getByRole("article").last();
      const reveals = revealsOf(lastBlock);

      expect(await isBelowFirstScreen(page, lastBlock)).toBe(true);
      for (const reveal of await reveals.all()) {
        expect(await playStateOf(reveal)).toBe("paused");
        expect(await opacityOf(reveal)).toBe("0");
      }

      await lastBlock.scrollIntoViewIfNeeded();

      for (const reveal of await reveals.all()) {
        await expect.poll(() => playStateOf(reveal)).toBe("running");
        await expectFullyShown(reveal);
      }

      // Scrolling away and back does not hide it again.
      await page.getByRole("article").first().scrollIntoViewIfNeeded();
      await lastBlock.scrollIntoViewIfNeeded();
      for (const reveal of await reveals.all()) {
        expect(await opacityOf(reveal)).toBe("1");
      }
      expect(consoleErrors).toEqual([]);
    });

    test("a block starts only once a fifth of it is on screen, not at its edge", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);
      const picture = revealsOf(page.getByRole("article").last()).first();

      expect(await playStateOf(picture)).toBe("paused");

      await scrollTopEdgeIntoView(picture, 30);
      await settleFrames(page);
      const visibleTop = await picture.evaluate(
        (element) => window.innerHeight - element.getBoundingClientRect().top,
      );
      expect(visibleTop).toBeGreaterThan(0);
      expect(visibleTop).toBeLessThanOrEqual(40);
      expect(await playStateOf(picture)).toBe("paused");
      expect(await opacityOf(picture)).toBe("0");

      await picture.scrollIntoViewIfNeeded();

      await expect.poll(() => playStateOf(picture)).toBe("running");
      await expectFullyShown(picture);
    });

    test.describe("with reduced motion", () => {
      test.use({ reducedMotion: "reduce" });

      test("every block is shown at once without scrolling", async ({
        page,
      }) => {
        await page.goto(`/${locale}/cases`);
        await expect(page.getByRole("article")).toHaveCount(3);

        for (const block of await page.getByRole("article").all()) {
          for (const reveal of await revealsOf(block).all()) {
            expect(await opacityOf(reveal)).toBe("1");
          }
        }
      });
    });
  });
}

const labels = {
  en: { achievements: "Achievements", moreInformation: "More information" },
  ru: { achievements: "Достижения", moreInformation: "Подробнее" },
} as const;

for (const locale of locales) {
  test.describe(`case page animations in ${locale}`, () => {
    test("the header animates in on load and the background stays at the page top", async ({
      consoleErrors,
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);
      const header = page.locator("main header").first();
      const reveals = header.locator('[class*="animate-reveal"]');

      // Background fade, back link, category with name, facts.
      await expect(reveals).toHaveCount(4);
      for (const reveal of await reveals.all()) {
        await expectFullyShown(reveal);
      }

      const background = header.locator(':scope > div[aria-hidden="true"]');
      const top = await background.evaluate(
        (element) => element.getBoundingClientRect().top + window.scrollY,
      );
      expect(top).toBe(0);
      expect(consoleErrors).toEqual([]);
    });

    test("the achievements wait until they are scrolled into view, then follow their title", async ({
      consoleErrors,
      page,
    }) => {
      // The stub case is short; a low viewport keeps its achievements below
      // the first screen on every project.
      const width = page.viewportSize()?.width ?? 1280;
      await page.setViewportSize({ height: 480, width });
      await page.goto(`/${locale}/cases/spectre`);
      const title = page
        .getByRole("heading", { level: 2, name: labels[locale].achievements })
        .locator("xpath=..");
      const item = page
        .getByRole("region", { name: labels[locale].achievements })
        .getByRole("listitem")
        .first();

      expect(await isBelowFirstScreen(page, title)).toBe(true);
      expect(await playStateOf(title)).toBe("paused");
      expect(await playStateOf(item)).toBe("paused");
      expect(await opacityOf(item)).toBe("0");

      await item.scrollIntoViewIfNeeded();

      await expectFullyShown(title);
      await expectFullyShown(item);
      const [titleDelay, itemDelay] = await Promise.all(
        [title, item].map((locator) =>
          locator.evaluate(
            (element) => getComputedStyle(element).animationDelay,
          ),
        ),
      );
      expect(titleDelay).toBe("0s");
      expect(itemDelay).toBe("0.12s");
      expect(consoleErrors).toEqual([]);
    });

    test("the last achievement animates in at the very bottom of the page", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/nova`);
      const lastItem = page
        .getByRole("region", { name: labels[locale].achievements })
        .getByRole("listitem")
        .last();

      // Reach the very bottom: the page's scroll container and the window.
      await page.evaluate(() => {
        for (const element of document.querySelectorAll("main *")) {
          if (
            ["auto", "scroll"].includes(getComputedStyle(element).overflowY)
          ) {
            element.scrollTo(0, element.scrollHeight);
          }
        }
        window.scrollTo(0, document.documentElement.scrollHeight);
      });

      await expectFullyShown(lastItem);
    });

    test.describe("with reduced motion", () => {
      test.use({ reducedMotion: "reduce" });

      test("every block is shown at once without scrolling", async ({
        page,
      }) => {
        await page.goto(`/${locale}/cases/spectre`);
        const reveals = page.locator('main [class*="animate-reveal"]');

        await expect(reveals).not.toHaveCount(0);
        for (const reveal of await reveals.all()) {
          expect(await opacityOf(reveal)).toBe("1");
        }
      });
    });
  });

  test(`keyboard focus reveals a case block that has not animated in yet in ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/cases`);
    const lastBlock = page.getByRole("article").last();
    const link = lastBlock.getByRole("link", {
      name: new RegExp(`^${labels[locale].moreInformation}:`),
    });

    expect(await isBelowFirstScreen(page, lastBlock)).toBe(true);
    for (let presses = 0; presses < 80; presses += 1) {
      if (
        await link.evaluate((element) => element === document.activeElement)
      ) {
        break;
      }
      await page.keyboard.press("Tab");
    }

    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    for (const reveal of await revealsOf(lastBlock).all()) {
      await expectFullyShown(reveal);
    }
  });
}
