import { expect, test } from "./support/test";

const getRedirectTarget = (location: string | undefined) => {
  expect(location, "redirect must have a Location header").toBeTruthy();

  const url = new URL(location ?? "", "http://localhost");

  return `${url.pathname}${url.search}`;
};

test.describe("locale redirects from the proxy", () => {
  const cases = [
    ["en-US,en;q=0.9", "/en"],
    ["en", "/en"],
    ["ru-RU,ru;q=0.9,en;q=0.8", "/ru"],
    ["de-DE,de;q=0.9", "/ru"],
  ] as const;

  for (const [acceptLanguage, expectedPath] of cases) {
    test(`/ with Accept-Language "${acceptLanguage}" goes to ${expectedPath}`, async ({
      request,
    }) => {
      const response = await request.get("/", {
        headers: { "Accept-Language": acceptLanguage },
        maxRedirects: 0,
      });

      expect(response.status()).toBe(307);
      expect(getRedirectTarget(response.headers()["location"])).toBe(
        expectedPath,
      );
    });
  }

  test("/ without Accept-Language goes to the default locale", async ({
    request,
  }) => {
    const response = await request.get("/", {
      headers: { "Accept-Language": "" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(getRedirectTarget(response.headers()["location"])).toBe("/ru");
  });

  test("keeps the path and the query string", async ({ request }) => {
    const response = await request.get("/cases?x=1", {
      headers: { "Accept-Language": "en" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(getRedirectTarget(response.headers()["location"])).toBe(
      "/en/cases?x=1",
    );
  });
});

test.describe("requests the proxy must not touch", () => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/favicon.ico"]) {
    test(`${path} is served without a redirect`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });

      expect(response.status()).toBe(200);
    });
  }

  test("an unknown /_next/static file is a 404, not a locale redirect", async ({
    request,
  }) => {
    const response = await request.get("/_next/static/missing.js", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(404);
  });

  test("an already localized path is not redirected", async ({ request }) => {
    const response = await request.get("/en/cases", {
      headers: { "Accept-Language": "ru" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(200);
  });
});

test.describe("unknown routes", () => {
  test("an unsupported locale is redirected under the default locale and 404s there", async ({
    request,
  }) => {
    const redirect = await request.get("/de", {
      headers: { "Accept-Language": "en" },
      maxRedirects: 0,
    });

    expect(redirect.status()).toBe(307);
    expect(getRedirectTarget(redirect.headers()["location"])).toBe("/en/de");

    const response = await request.get("/en/de", { maxRedirects: 0 });

    expect(response.status()).toBe(404);
  });

  for (const path of ["/ru/cases/unknown", "/en/cases/unknown"]) {
    test(`${path} is a 404`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });

      expect(response.status()).toBe(404);
    });
  }
});
