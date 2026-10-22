import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

import type { Dictionary } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n-server";

import { SiteLayout } from "./SiteLayout";

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "font-variable" }),
}));

vi.mock("@/widgets/header", () => ({
  Header: () => <nav aria-label="Main" />,
}));

let dictionary: Dictionary;

beforeAll(async () => {
  dictionary = await getDictionary("en");
});

const render = () =>
  renderToStaticMarkup(
    <SiteLayout dictionary={dictionary} locale="en">
      <p>page</p>
    </SiteLayout>,
  );

describe("SiteLayout", () => {
  it("makes the body the containing block for page-top backgrounds", () => {
    expect(render()).toMatch(/<body class="[^"]*\brelative\b/);
  });

  it("keeps the site header before the page content", () => {
    const markup = render();

    expect(markup.indexOf("<nav")).toBeLessThan(markup.indexOf("<main"));
  });

  it("sets the document language from the locale", () => {
    expect(render()).toContain('<html lang="en"');
  });
});
