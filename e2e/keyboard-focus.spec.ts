import { expect, test } from "./support/test";

test("every Tab stop shows a visible focus ring", async ({ page }) => {
  for (const path of ["/ru", "/ru/cases", "/ru/contacts"]) {
    await page.goto(path);

    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press("Tab");

      const outline = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        const peer = el.matches("input.peer")
          ? getComputedStyle(el.nextElementSibling ?? el)
          : style;
        return {
          width: peer.outlineWidth,
          style: peer.outlineStyle,
          border: style.borderTopColor,
        };
      });

      if (outline === null) break;
      const ringed = outline.style !== "none" && outline.width !== "0px";
      const borderOnly = outline.border !== "rgba(0, 0, 0, 0)";
      expect(ringed || borderOnly, `${path} step ${step}`).toBe(true);
    }
  }
});
