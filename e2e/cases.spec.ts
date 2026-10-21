import { locales } from "./support/routes";
import { expect, test } from "./support/test";

const labels = {
  en: {
    noImage: "No image",
    present: "present",
    moreInformation: "More information",
  },
  ru: {
    noImage: "Нет картинки",
    present: "по настоящее время",
    moreInformation: "Подробнее",
  },
} as const;

for (const locale of locales) {
  test.describe(`cases in ${locale}`, () => {
    test("the list shows every backend case with its project link", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      await expect(page.getByRole("article")).toHaveCount(3);
      for (const name of [
        "Spectre Explorer",
        "Orbit Booking",
        "Nova Console",
      ]) {
        await expect(
          page.getByRole("heading", { level: 2, name }),
        ).toBeVisible();
      }
      await expect(page.locator('main a[target="_blank"]')).toHaveCount(3);
    });

    test("the list shows the no-image text for a case without a picture", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      await expect(page.getByText(labels[locale].noImage)).toHaveCount(1);
    });

    test("an ongoing case reads as present and hides empty facts", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/orbit`);

      await expect(
        page.getByText(new RegExp(`– ${labels[locale].present}$`)),
      ).toBeVisible();
      await expect(page.getByText(labels[locale].noImage)).toBeVisible();
      await expect(page.locator("dt")).toHaveCount(4);
    });

    test("a finished case shows the company, team size and the project link", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);

      await expect(page.getByText("Spectre Labs")).toBeVisible();
      await expect(page.locator("dt")).toHaveCount(6);
      await expect(
        page.getByRole("link", { name: /Spectre Explorer$/ }).first(),
      ).toHaveAttribute("href", "https://example.com/spectre");
    });
  });
}

test("the sitemap lists the cases of the backend", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();

  for (const locale of locales) {
    for (const slug of ["spectre", "orbit", "nova"]) {
      expect(body).toContain(`/${locale}/cases/${slug}</loc>`);
    }
  }
});
