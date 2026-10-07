import { expect, test as base, type Route } from "@playwright/test";

// 1x1 transparent PNG, used instead of remote images so tests do not depend
// on picsum.photos being reachable.
const PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

type Fixtures = {
  /** Console errors and uncaught page errors collected during the test. */
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, provide) => {
    const fulfillWithPixel = (route: Route) =>
      route.fulfill({ body: PIXEL_PNG, contentType: "image/png" });

    await page.route("**/_next/image**", fulfillWithPixel);
    await page.route("https://picsum.photos/**", fulfillWithPixel);

    await provide(page);
  },
  consoleErrors: async ({ page }, provide) => {
    const errors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await provide(errors);
  },
});

export { expect };
