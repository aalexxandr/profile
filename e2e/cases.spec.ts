import { locales } from "./support/routes";
import { expect, test } from "./support/test";

const labels = {
  en: {
    about: "About case",
    back: "Back to cases",
    achievements: "Achievements",
    noImage: "No image",
    team: { label: "Team", value: "6 people" },
    present: "present",
    moreInformation: "More information",
    periods: {
      finished: "March 2023 – June 2024",
      open: "September 2024 – present",
    },
    stack: "Stack",
  },
  ru: {
    about: "О кейсе",
    back: "Назад к кейсам",
    achievements: "Достижения",
    noImage: "Нет картинки",
    team: { label: "Команда", value: "6 человек" },
    present: "по настоящее время",
    moreInformation: "Подробнее",
    periods: {
      finished: "март 2023 – июнь 2024",
      open: "сентябрь 2024 – по настоящее время",
    },
    stack: "Стек",
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

      await expect(page.getByText(labels[locale].periods.open)).toBeVisible();
      await expect(page.getByText(labels[locale].noImage)).toHaveCount(0);
      await expect(page.locator("dt")).toHaveCount(2);
    });

    test("the case page shows the background but not the case picture", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);

      await expect(page.locator('img[src*="7c4e9a1b2d3f5068"]')).toHaveCount(1);
      await expect(page.locator('img[src*="3f9a1c2b7d4e5f60"]')).toHaveCount(0);
    });

    test("a finished case shows the company, team size and the project link", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);

      await expect(page.getByText("Spectre Labs")).toBeVisible();
      await expect(
        page.getByText(labels[locale].periods.finished),
      ).toBeVisible();
      await expect(page.getByText(labels[locale].team.label)).toBeVisible();
      await expect(page.getByText(labels[locale].team.value)).toBeVisible();
      await expect(page.locator("dt")).toHaveCount(4);
      await expect(
        page.getByRole("link", { name: /Spectre Explorer$/ }).first(),
      ).toHaveAttribute("href", "https://example.com/spectre");
    });

    test("the case header shows the name and category and leads back to the list", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);

      await expect(
        page.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
      ).toBeVisible();
      await expect(page.getByText("FinTech / Web App")).toBeVisible();

      await page.getByRole("link", { name: labels[locale].back }).click();

      await expect(page).toHaveURL(new RegExp(`/${locale}/cases$`));
    });

    test("the case page shows about, stack and achievements sections", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/spectre`);

      await expect(
        page.getByRole("region", { name: labels[locale].about }),
      ).toBeVisible();
      const stack = page.getByRole("region", { name: labels[locale].stack });
      await expect(stack.getByRole("listitem")).toHaveText([
        /React/,
        /TypeScript/,
      ]);
      const achievements = page.getByRole("region", {
        name: labels[locale].achievements,
      });
      await expect(achievements.getByText("-40%")).toBeVisible();
    });

    test("a case without a background still shows its header", async ({
      page,
      consoleErrors,
    }) => {
      await page.goto(`/${locale}/cases/orbit`);

      await expect(
        page.getByRole("heading", { level: 1, name: "Orbit Booking" }),
      ).toBeVisible();
      expect(consoleErrors).toEqual([]);
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
