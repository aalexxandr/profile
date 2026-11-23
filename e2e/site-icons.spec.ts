import { expect, test } from "./support/test";

// `app/icon.svg` is the main icon; `app/favicon.ico` answers clients that ask
// for /favicon.ico directly, and `app/apple-icon.png` is the iOS home screen
// icon (SVG is not used there).
const icons = [
  { path: "/favicon.ico", type: /^image\/(x-icon|vnd\.microsoft\.icon)/ },
  { path: "/icon.svg", type: /^image\/svg\+xml/ },
  { path: "/apple-icon.png", type: /^image\/png/ },
];

for (const { path, type } of icons) {
  test(`${path} is served as an image`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(type);
  });
}

for (const locale of ["ru", "en"]) {
  test(`/${locale} links the site icons in the head`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const head = page.locator("head");

    await expect(
      head.locator('link[rel="icon"][href^="/favicon.ico"]'),
    ).toHaveCount(1);
    await expect(
      head.locator('link[rel="icon"][type="image/svg+xml"][href^="/icon.svg"]'),
    ).toHaveCount(1);
    await expect(
      head.locator('link[rel="apple-touch-icon"][href^="/apple-icon.png"]'),
    ).toHaveCount(1);
  });
}
