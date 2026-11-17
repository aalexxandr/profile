import { en } from "../src/shared/i18n-server/dictionaries/en";
import { ru } from "../src/shared/i18n-server/dictionaries/ru";
import type { Locator, Page } from "@playwright/test";

import { expect, test } from "./support/test";

const EMAIL = "alexxaandr.m@gmail.com";
const TELEGRAM_URL = "https://t.me/alexxaandr";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexxaandr";

const locales = [
  { contacts: en.pages.contacts, locale: "en" },
  { contacts: ru.pages.contacts, locale: "ru" },
] as const;

// Vertical distance of each element from the name field: it does not depend
// on how far the scroll container is scrolled, unlike a plain bounding box.
const offsetsFromName = async (page: Page, targets: Locator[]) => {
  // The entrance animation moves the blocks until it ends.
  await page.evaluate(() =>
    Promise.all(
      document.getAnimations().map((animation) => animation.finished),
    ),
  );
  const nameTop =
    (await page.locator("main form input").first().boundingBox())?.y ?? 0;

  return Promise.all(
    targets.map(
      async (target) => ((await target.boundingBox())?.y ?? 0) - nameTop,
    ),
  );
};

for (const { contacts, locale } of locales) {
  const { form } = contacts;

  test.describe(`/${locale}/contacts`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/contacts`);
    });

    test("shows the title, the info text and the illustration", async ({
      page,
    }) => {
      await expect(
        page.getByRole("heading", { level: 1, name: contacts.title }),
      ).toBeVisible();
      await expect(page.getByText(contacts.infoText)).toBeVisible();
      await expect(
        page.getByRole("img", { name: contacts.illustrationAlt }),
      ).toBeVisible();
    });

    test("links to the email, Telegram and LinkedIn only", async ({ page }) => {
      const main = page.locator("main");

      await expect(main.getByRole("link", { name: EMAIL })).toHaveAttribute(
        "href",
        `mailto:${EMAIL}`,
      );
      await expect(
        main.getByRole("link", { name: contacts.links.telegram }),
      ).toHaveAttribute("href", TELEGRAM_URL);
      await expect(
        main.getByRole("link", { name: contacts.links.linkedin }),
      ).toHaveAttribute("href", LINKEDIN_URL);
      await expect(main.locator('a[href^="tel:"]')).toHaveCount(0);
      await expect(
        main.locator('a[href*="wa.me"], a[href*="x.com"], a[href*="twitter"]'),
      ).toHaveCount(0);
    });

    test("has no service selector and no phone method", async ({ page }) => {
      await expect(page.getByRole("combobox")).toHaveCount(0);
      await expect(page.getByRole("radio")).toHaveCount(2);
      await expect(
        page.getByRole("radio", { name: form.methods.email }),
      ).toBeChecked();
    });

    test("Tab reaches both contact methods and Space selects one", async ({
      page,
    }) => {
      const email = page.getByRole("radio", { name: form.methods.email });
      const telegram = page.getByRole("radio", { name: form.methods.telegram });

      await email.focus();
      await page.keyboard.press("Tab");
      await expect(telegram).toBeFocused();

      await page.keyboard.press("Space");
      await expect(telegram).toBeChecked();
      await expect(email).not.toBeChecked();

      await page.keyboard.press("Shift+Tab");
      await expect(email).toBeFocused();
    });

    test("shows localized errors on an empty submit", async ({ page }) => {
      await page.getByRole("button", { name: form.send }).click();

      await expect(page.getByText(form.errors.required)).toHaveCount(3);
      await expect(page.getByText(form.success.title)).toHaveCount(0);
    });

    test("swaps the contact field in place without changing the form height", async ({
      page,
    }) => {
      const email = page.getByLabel(new RegExp(form.emailLabel));
      const telegram = page.getByLabel(new RegExp(form.usernameLabel));
      const message = page.getByLabel(new RegExp(form.messageLabel));
      const send = page.getByRole("button", { name: form.send });
      const method = (label: string) =>
        page.locator("label").filter({
          has: page.getByRole("radio", { name: label }),
        });

      await expect(email).toBeVisible();
      await expect(telegram).toHaveCount(0);

      const before = await offsetsFromName(page, [email, message, send]);

      await method(form.methods.telegram).click();
      await expect(
        page.getByRole("radio", { name: form.methods.telegram }),
      ).toBeChecked();
      await expect(telegram).toBeVisible();
      await expect(email).toHaveCount(0);
      expect(await offsetsFromName(page, [telegram, message, send])).toEqual(
        before,
      );

      await method(form.methods.telegram).click();
      await expect(
        page.getByRole("radio", { name: form.methods.telegram }),
      ).toBeChecked();

      await method(form.methods.email).click();
      await expect(email).toBeVisible();
      await expect(telegram).toHaveCount(0);
      expect(await offsetsFromName(page, [email, message, send])).toEqual(
        before,
      );
    });

    test("asks for the Telegram value when Telegram is selected", async ({
      page,
    }) => {
      await page
        .locator("label")
        .filter({
          has: page.getByRole("radio", { name: form.methods.telegram }),
        })
        .click();
      await page.getByRole("button", { name: form.send }).click();

      await expect(page.getByText(form.errors.required)).toHaveCount(3);
      await expect(
        page.getByLabel(new RegExp(form.usernameLabel)),
      ).toHaveAccessibleDescription(form.errors.required);
    });

    test("returns to Email without moving the form after a Telegram submit", async ({
      page,
    }) => {
      const send = page.getByRole("button", { name: form.send });
      const before = await offsetsFromName(page, [send]);

      await page
        .locator("label")
        .filter({
          has: page.getByRole("radio", { name: form.methods.telegram }),
        })
        .click();
      await page.getByLabel(new RegExp(form.nameLabel)).fill("Alex");
      await page.getByLabel(new RegExp(form.usernameLabel)).fill("@alex");
      await page.getByLabel(new RegExp(form.messageLabel)).fill("Hello");
      await send.click();

      await expect(page.getByText(form.success.title)).toBeVisible();
      await expect(
        page.getByRole("radio", { name: form.methods.email }),
      ).toBeChecked();
      await expect(page.getByLabel(new RegExp(form.emailLabel))).toHaveValue(
        "",
      );
      expect(await offsetsFromName(page, [send])).toEqual(before);
    });

    test("stops typing at 100 characters in the name without a message", async ({
      page,
    }) => {
      const name = page.getByLabel(new RegExp(form.nameLabel));

      await name.pressSequentially("a".repeat(105));

      await expect(name).toHaveValue("a".repeat(100));
      await expect(page.getByText(/100/)).toHaveCount(0);
    });

    test("pretends to send: clears the form, no request", async ({ page }) => {
      const requests: string[] = [];

      page.on("request", (request) => {
        if (request.method() !== "GET") {
          requests.push(request.url());
        }
      });

      const name = page.getByLabel(new RegExp(form.nameLabel));
      const email = page.getByLabel(new RegExp(form.emailLabel));
      const message = page.getByLabel(new RegExp(form.messageLabel));

      await name.fill("Alex");
      await email.fill("a@b.co");
      await message.fill("Hello");
      await page.getByRole("button", { name: form.send }).click();

      await expect(page.getByRole("status")).toContainText(form.success.title);
      await expect(page.getByRole("status")).toContainText(form.success.text);
      await expect(name).toHaveValue("");
      await expect(email).toHaveValue("");
      await expect(message).toHaveValue("");
      expect(requests).toEqual([]);
    });

    test("shows the notice as a corner popup that does not cover the menu or move the form and hides itself", async ({
      page,
    }) => {
      await page.getByLabel(new RegExp(form.nameLabel)).fill("Alex");
      await page.getByLabel(new RegExp(form.emailLabel)).fill("a@b.co");
      await page.getByLabel(new RegExp(form.messageLabel)).fill("Hello");

      const send = page.getByRole("button", { name: form.send });

      await send.scrollIntoViewIfNeeded();

      const before = await send.boundingBox();

      await send.click();

      const toast = page.getByText(form.success.title);

      await expect(toast).toBeVisible();

      const toastBox = await toast.boundingBox();

      const menuBox = await page.getByRole("banner").boundingBox();
      const viewportHeight = page.viewportSize()?.height ?? 0;

      expect(toastBox?.y).toBeGreaterThan(viewportHeight / 2);
      expect(toastBox?.y).toBeGreaterThanOrEqual(
        (menuBox?.y ?? 0) + (menuBox?.height ?? 0),
      );
      expect(await send.boundingBox()).toEqual(before);
      await expect(
        page.getByRole("button", { name: /close|закрыть/i }),
      ).toHaveCount(0);
      await expect(toast).toBeHidden({ timeout: 10_000 });
    });

    test("puts the icon links below the email", async ({ page }) => {
      const main = page.locator("main");
      const email = await main.getByRole("link", { name: EMAIL }).boundingBox();
      const telegram = await main
        .getByRole("link", { name: contacts.links.telegram })
        .boundingBox();
      const linkedin = await main
        .getByRole("link", { name: contacts.links.linkedin })
        .boundingBox();

      expect(telegram?.y).toBeGreaterThanOrEqual(
        (email?.y ?? 0) + (email?.height ?? 0) - 1,
      );
      expect(linkedin?.y).toBeGreaterThanOrEqual(
        (email?.y ?? 0) + (email?.height ?? 0) - 1,
      );
    });

    test("keeps keyboard order: links, name, method, contact, message, send", async ({
      page,
    }) => {
      await page.getByRole("link", { name: EMAIL }).focus();

      const order = [
        contacts.links.telegram,
        contacts.links.linkedin,
        new RegExp(form.nameLabel),
        form.methods.email,
        form.methods.telegram,
        new RegExp(form.emailLabel),
        new RegExp(form.messageLabel),
        form.send,
      ];

      for (const name of order) {
        await page.keyboard.press("Tab");
        await expect(page.locator(":focus")).toHaveAccessibleName(name);
      }
    });

    test("does not scroll horizontally", async ({ page }) => {
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );

      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
