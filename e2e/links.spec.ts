import { allPaths } from "./support/routes";
import { expect, test } from "./support/test";

test("no internal link on any page leads to a missing page", async ({
  page,
  request,
}) => {
  const hrefs = new Set<string>();

  for (const { path } of allPaths) {
    await page.goto(path);

    const pageHrefs = await page
      .locator("a[href]")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );

    for (const href of pageHrefs) {
      if (href.startsWith("/")) {
        hrefs.add(href.split("#")[0] ?? href);
      }
    }
  }

  // Guard against a vacuous pass: the case links must have been collected.
  expect([...hrefs]).toEqual(
    expect.arrayContaining(["/ru/cases/product-ui", "/en/cases/product-ui"]),
  );

  const broken: string[] = [];

  for (const href of hrefs) {
    const response = await request.get(href);

    if (!response.ok()) {
      broken.push(`${href} -> ${response.status()}`);
    }
  }

  expect(broken).toEqual([]);
});
