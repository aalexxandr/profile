import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CaseFact } from "@/views/case-details/model/types";

import { CaseFacts } from "./CaseFacts";

const facts: CaseFact[] = [
  { id: "role", label: "Role", value: "Frontend developer" },
  { id: "period", label: "Period", value: "March 2023 – June 2024" },
  { id: "company", label: "Company", value: "Spectre Labs" },
  { id: "team", label: "Team", value: "6 people" },
];

const renderFacts = (list: CaseFact[] = facts) =>
  render(<CaseFacts facts={list} />);

const getFacts = (container: HTMLElement) =>
  container.querySelector("dl") as HTMLElement;

const getCells = (container: HTMLElement) => [
  ...getFacts(container).querySelectorAll(":scope > div"),
];

describe("CaseFacts", () => {
  it("lies on the picture without a frame, a fill or a blur", () => {
    const { container } = renderFacts();
    const list = getFacts(container);

    expect(list).not.toHaveClass("border");
    expect(list).not.toHaveClass("border-dashed");
    expect(list.className).not.toMatch(/(^|\s)bg-/);
    expect(list.className).not.toContain("backdrop-blur");
  });

  it("has one cell with a label and a value per fact, in the given order", () => {
    const { container } = renderFacts();

    expect(getCells(container).map((cell) => cell.textContent)).toEqual([
      "RoleFrontend developer",
      "PeriodMarch 2023 – June 2024",
      "CompanySpectre Labs",
      "Team6 people",
    ]);
  });

  it("renders no cell for a fact that is not in the list", () => {
    const { container } = renderFacts(facts.slice(0, 2));

    expect(getCells(container)).toHaveLength(2);
    expect(screen.queryByText("Company")).toBeNull();
  });

  it("stacks the label above the value in every cell", () => {
    const { container } = renderFacts();

    for (const cell of getCells(container)) {
      const label = cell.querySelector("dt") as HTMLElement;
      const value = cell.querySelector("dd") as HTMLElement;

      expect(cell).toHaveClass("flex-col");
      expect(
        label.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("separates the cells with dashed dividers in a row and in a grid", () => {
    const { container } = renderFacts();
    const { className } = getFacts(container);

    expect(className).toMatch(/lg:\S*div\+div\S*border-l/);
    expect(className).toMatch(/nth-child\(n\+3\)\S*border-t/);
    expect(className).toMatch(/nth-child\(even\)\S*border-l/);
    expect(className).toContain("grid-cols-2");
    expect(className).toContain("lg:flex");
  });

  it("puts one decorative icon of its own before every label", () => {
    const { container } = renderFacts();
    const labels = getFacts(container).querySelectorAll("dt");

    expect(
      [...labels].map((label) => label.querySelector("svg")?.dataset.icon),
    ).toEqual(["role", "period", "company", "team"]);
    for (const label of labels) {
      const icons = label.querySelectorAll("svg");

      expect(icons).toHaveLength(1);
      expect(icons[0]).toHaveAttribute("aria-hidden", "true");
      expect(icons[0]).toHaveAttribute("focusable", "false");
      expect(label.firstElementChild).toBe(icons[0]);
    }
  });

  it("keeps the label text free of the icon", () => {
    const { container } = renderFacts();

    expect(
      [...getFacts(container).querySelectorAll("dt")].map(
        (label) => label.textContent,
      ),
    ).toEqual(["Role", "Period", "Company", "Team"]);
  });

  it("capitalises only the period value", () => {
    const { container } = renderFacts();

    expect(
      getCells(container).map((cell) => cell.classList.contains("capitalize")),
    ).toEqual([false, true, false, false]);
  });
});
