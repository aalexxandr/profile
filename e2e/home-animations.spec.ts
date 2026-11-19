import { locales } from "./support/routes";
import { expect, test } from "./support/test";

for (const locale of locales) {
  test(`the ${locale} home page renders the coffee and the cat paws animations only on wide screens`, async ({
    consoleErrors,
    isMobile,
    page,
  }) => {
    // The lottie library is the only script that contains this class name.
    let lottieScriptLoaded = false;

    page.on("response", async (response) => {
      if (
        response.url().endsWith(".js") &&
        (await response.text()).includes("lottie-display")
      ) {
        lottieScriptLoaded = true;
      }
    });

    await page.goto(`/${locale}`);
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      // The scene is hidden below `lg`: no animation is mounted and the
      // library chunk is never requested.
      await expect(page.locator(".lottie-display")).toHaveCount(0);
      expect(lottieScriptLoaded).toBe(false);
    } else {
      await expect(page.locator(".lottie-display svg")).toHaveCount(2);
      await expect(
        page.locator(".lottie-display svg g").first(),
      ).toBeAttached();
      expect(lottieScriptLoaded).toBe(true);
    }

    expect(consoleErrors).toEqual([]);
  });
}

for (const locale of locales) {
  test(`the ${locale} home scene pictures that are hidden on phones are not downloaded there`, async ({
    isMobile,
    page,
  }) => {
    const sceneRequests: string[] = [];

    page.on("request", (request) => {
      if (/(shelves|painting|table)[^/]*\.svg/.test(request.url())) {
        sceneRequests.push(request.url());
      }
    });

    await page.goto(`/${locale}`);
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      expect(sceneRequests).toEqual([]);
    } else {
      // The shelves are the LCP picture on desktop: loaded at once.
      expect(sceneRequests.some((url) => url.includes("shelves"))).toBe(true);
    }
  });
}

for (const locale of locales) {
  test(`the ${locale} home typewriter keeps a long phrase and its caret on one line`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const phrase = "Never lost, always exploring.";
    const line = page.locator('span[aria-hidden="true"]', { hasText: phrase });
    await expect(line).toBeVisible({ timeout: 15_000 });

    const { scrollWidth, clientWidth, height } = await line.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      height: el.getBoundingClientRect().height,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    // One 18-20px line; a wrapped caret would make it about twice as tall.
    expect(height).toBeLessThan(30);
  });
}
