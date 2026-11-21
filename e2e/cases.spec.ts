import { locales } from "./support/routes";
import { expect, test } from "./support/test";

const labels = {
  en: {
    about: "About case",
    back: "Back to cases",
    achievements: "Achievements",
    noImage: "No image",
    projectPrivate: "Private project",
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
    projectPrivate: "Закрытый проект",
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
      await expect(page.locator('main a[target="_blank"]')).toHaveCount(2);
    });

    test("the list shows the private project label for a case without a project link", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      await expect(page.getByText(labels[locale].projectPrivate)).toHaveCount(
        1,
      );
      await expect(
        page
          .getByRole("article")
          .filter({ hasText: "Nova Console" })
          .getByRole("link", { name: /Nova Console$/ }),
      ).toHaveCount(1);
    });

    test("the case page shows the private project label instead of the project link", async ({
      page,
      consoleErrors,
    }) => {
      await page.goto(`/${locale}/cases/nova`);

      const about = page.getByRole("region", { name: labels[locale].about });

      await expect(
        about.getByText(labels[locale].projectPrivate),
      ).toBeVisible();
      await expect(about.getByRole("link")).toHaveCount(0);
      expect(consoleErrors).toEqual([]);
    });

    test("the list shows the no-image text for a case without a picture", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      await expect(page.getByText(labels[locale].noImage)).toHaveCount(1);
    });

    test("a case picture keeps its 520:430 frame after it loads", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      // The stubbed picture is 1x1, so a frame following the file's own
      // ratio would turn square once it loads.
      const picture = page
        .getByRole("article")
        .filter({ hasText: "Spectre Explorer" })
        .getByRole("img", { name: "Spectre Explorer" });

      await picture.scrollIntoViewIfNeeded();
      // `complete` only: the mobile project reports `naturalWidth` 0 for the
      // stub pixel even though the load has finished.
      await expect
        .poll(() => picture.evaluate((img: HTMLImageElement) => img.complete))
        .toBe(true);

      const box = await picture.boundingBox();

      expect(box).not.toBeNull();
      expect(Math.abs(box!.height - (box!.width * 430) / 520)).toBeLessThan(1);
    });

    test("a long short description is shown whole above a visible button", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      const window = page.getByRole("region", { name: "Orbit Booking" });
      const description = window.locator("h2 ~ p");
      const metrics = await description.evaluate((element) => ({
        clipped: element.scrollHeight > element.clientHeight,
        height: element.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(element).lineHeight),
      }));

      // The stub text is long on purpose: more than the old 4-line limit.
      expect(metrics.clipped).toBe(false);
      expect(metrics.height).toBeGreaterThan(4 * metrics.lineHeight + 1);

      const button = await window
        .getByRole("link", {
          name: `${labels[locale].moreInformation}: Orbit Booking`,
        })
        .boundingBox();
      const windowBox = await window.boundingBox();

      expect(button).not.toBeNull();
      expect(windowBox).not.toBeNull();
      expect(button!.y).toBeGreaterThanOrEqual(windowBox!.y);
      expect(button!.y + button!.height).toBeLessThanOrEqual(
        windowBox!.y + windowBox!.height,
      );
    });

    test("a short description is shown whole and the card ends at its button", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases`);

      const window = page.getByRole("region", { name: "Spectre Explorer" });
      const metrics = await window.locator("h2 ~ p").evaluate((element) => ({
        clipped: element.scrollHeight > element.clientHeight,
        contentBottom: element.parentElement!.getBoundingClientRect().bottom,
      }));
      const button = await window
        .getByRole("link", {
          name: `${labels[locale].moreInformation}: Spectre Explorer`,
        })
        .boundingBox();

      expect(metrics.clipped).toBe(false);
      expect(button).not.toBeNull();
      // No empty space kept below the button for lines the text does not use.
      expect(
        Math.abs(metrics.contentBottom - (button!.y + button!.height)),
      ).toBeLessThan(1);
    });

    test("an ongoing case reads as present and hides empty facts", async ({
      page,
    }) => {
      await page.goto(`/${locale}/cases/orbit`);

      await expect(page.getByText(labels[locale].periods.open)).toBeVisible();
      await expect(page.getByText(labels[locale].noImage)).toHaveCount(0);
      await expect(page.locator("dt")).toHaveCount(2);
    });

    test("the case page shows no picture of the case", async ({ page }) => {
      await page.goto(`/${locale}/cases/spectre`);

      await expect(
        page.getByRole("heading", { level: 1, name: "Spectre Explorer" }),
      ).toBeVisible();
      await expect(page.locator("main img")).toHaveCount(0);
      await expect(page.getByText(labels[locale].noImage)).toHaveCount(0);
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
