import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { locales, type Dictionary, type Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import type { CaseDetail } from "../api/types";
import { CaseAchievements } from "./CaseAchievements";

const dictionaries: Record<Locale, Dictionary> = { en, ru };

const achievements: CaseDetail["achievements"] = [
  { description: "Faster reviews", metric: "-40%", title: "Reporting" },
  { description: "Reusable states", metric: "30+", title: "UI states" },
];

const renderAchievements = (
  items: CaseDetail["achievements"],
  locale: Locale = "en",
) =>
  render(
    <CaseAchievements
      achievements={items}
      cases={dictionaries[locale].pages.cases}
    />,
  );

const follows = (first: HTMLElement, second: HTMLElement) =>
  Boolean(
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING,
  );

describe("CaseAchievements", () => {
  it.each([
    ["en", "Achievements"],
    ["ru", "Достижения"],
  ] as const)("is titled %s as %s", (locale, title) => {
    renderAchievements(achievements, locale);
    const section = screen.getByRole("region", { name: title });

    expect(
      within(section).getByRole("heading", { level: 2, name: title }),
    ).toBeInTheDocument();
  });

  it("shows the title, description and result of every achievement", () => {
    renderAchievements(achievements);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    for (const [
      index,
      { description, metric, title },
    ] of achievements.entries()) {
      const item = within(items[index] as HTMLElement);

      expect(item.getByText(title)).toBeInTheDocument();
      expect(item.getByText(description)).toBeInTheDocument();
      expect(item.getByText(metric)).toBeInTheDocument();
    }
  });

  it("orders each achievement as title, description, result", () => {
    renderAchievements(achievements);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");

    for (const [
      index,
      { description, metric, title },
    ] of achievements.entries()) {
      const item = within(items[index] as HTMLElement);

      expect(follows(item.getByText(title), item.getByText(description))).toBe(
        true,
      );
      expect(follows(item.getByText(description), item.getByText(metric))).toBe(
        true,
      );
    }
  });

  it("numbers the items with a decorative index in list order", () => {
    renderAchievements(achievements);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");

    for (const [index, item] of items.entries()) {
      const marker = within(item).getByText(`0${index + 1}`);

      expect(marker).toHaveAttribute("aria-hidden", "true");
      expect(marker).toHaveClass("font-vcr", "text-white/40");
    }
  });

  it("keeps the index out of the accessible names", () => {
    renderAchievements(achievements);

    expect(screen.queryByRole("generic", { name: "01" })).toBeNull();
    expect(
      screen.getByRole("list").querySelectorAll('[aria-hidden="true"]'),
    ).toHaveLength(achievements.length);
  });

  it("separates the items with a dashed rule but not the first one", () => {
    renderAchievements(achievements);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");

    for (const item of items) {
      expect(item).toHaveClass("border-dashed", "border-white/20");
      expect(item).toHaveClass("first:border-t-0");
    }
  });

  it("makes the section title larger than the other section titles", () => {
    renderAchievements(achievements);
    const title = screen.getByRole("heading", { level: 2 });

    expect(title).toHaveClass("text-[24px]", "sm:text-[32px]");
    expect(title).not.toHaveClass("text-[18px]");
  });

  it.each(locales)(
    "renders no section and no title when empty in %s",
    (locale) => {
      const { container } = renderAchievements([], locale);

      expect(container).toBeEmptyDOMElement();
    },
  );
});

// Never reports an intersection, so sections waiting for the viewport stay paused.
class NeverIntersectingObserver {
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

const PAUSED = "[animation-play-state:paused]";

describe("CaseAchievements entrance animation", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", NeverIntersectingObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("slides the title in once it is scrolled into view", () => {
    renderAchievements(achievements);
    const title = screen.getByRole("heading", {
      level: 2,
      name: "Achievements",
    }).parentElement;

    expect(title).toHaveClass("animate-reveal-up", PAUSED);
  });

  it("brings the achievements in one after another, keeping the list", () => {
    renderAchievements([
      ...achievements,
      { description: "Docs", metric: "12", title: "Guides" },
    ]);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");

    expect(items.map((item) => item.parentElement)).toEqual([list, list, list]);
    expect(items.map((item) => item.style.animationDelay)).toEqual([
      "120ms",
      "200ms",
      "280ms",
    ]);
    for (const item of items) {
      expect(item).toHaveClass("animate-reveal-up", PAUSED);
    }
  });

  it("keeps the dashed divider on the moving item", () => {
    renderAchievements(achievements);
    const [, second] = within(screen.getByRole("list")).getAllByRole(
      "listitem",
    );

    expect(second).toHaveClass("border-t", "border-dashed");
  });
});
