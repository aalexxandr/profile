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
