import { locales } from "./support/routes";
import { expect, test } from "./support/test";

for (const locale of locales) {
  test(`the ${locale} home page renders the coffee and the cat paws animations`, async ({
    consoleErrors,
    page,
  }) => {
    await page.goto(`/${locale}`);

    // The scene is hidden on narrow screens, so only presence is asserted.
    await expect(page.locator(".lottie-display svg")).toHaveCount(2);
    await expect(page.locator(".lottie-display svg g").first()).toBeAttached();

    expect(consoleErrors).toEqual([]);
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
