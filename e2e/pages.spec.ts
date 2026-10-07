import { allPaths } from "./support/routes";
import { expect, test } from "./support/test";

const getPathname = (href: string | null) => new URL(href ?? "").pathname;

for (const { locale, path, suffix } of allPaths) {
  test.describe(path, () => {
    test("renders with correct metadata and no console errors", async ({
      consoleErrors,
      page,
    }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toBeVisible();

      await expect(page).toHaveTitle(/\S/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /\S/,
      );

      expect(
        getPathname(
          await page.locator('link[rel="canonical"]').getAttribute("href"),
        ),
      ).toBe(path);

      for (const [hreflang, target] of [
        ["en", `/en${suffix}`],
        ["ru", `/ru${suffix}`],
        ["x-default", `/ru${suffix}`],
      ] as const) {
        expect(
          getPathname(
            await page
              .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
              .getAttribute("href"),
          ),
          `hreflang=${hreflang}`,
        ).toBe(target);
      }

      expect(consoleErrors).toEqual([]);
    });
  });
}
