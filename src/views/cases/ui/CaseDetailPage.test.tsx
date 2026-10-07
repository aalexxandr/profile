import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Dictionary } from "@/shared/i18n";

import { getMockCase } from "../model/case-full";
import { CaseDetailPage } from "./CaseDetailPage";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const cases: Dictionary["pages"]["cases"] = {
  actions: { moreInformation: "More information", projectLink: "Project link" },
  controlLabels: {
    close: "Close window",
    fullScreen: "Full screen window",
    minimize: "Minimize window",
  },
  detail: {
    achievementsTitle: "Results",
    backToCases: "Back to cases",
    categoryLabel: "Category",
    roleLabel: "Role",
    stackLabel: "Stack",
  },
  status: { objects: "objects" },
  title: "cases",
};

const renderPage = () => {
  const caseItem = getMockCase("en", "product-ui");

  if (!caseItem) {
    throw new Error("Expected the product-ui mock case to exist");
  }

  render(<CaseDetailPage caseItem={caseItem} cases={cases} locale="en" />);

  return caseItem;
};

describe("CaseDetailPage", () => {
  it("has the case name as the only h1", () => {
    const caseItem = renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: caseItem.name }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the description, role, stack and category", () => {
    const caseItem = renderPage();

    expect(screen.getByText(caseItem.description)).toBeInTheDocument();
    expect(screen.getByText(caseItem.role)).toBeInTheDocument();
    expect(screen.getByText(caseItem.stack.join(", "))).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText(caseItem.category)).toBeInTheDocument();
  });

  it("shows the objects counter from the case data", () => {
    const caseItem = renderPage();

    expect(
      screen.getByText(`${caseItem.objectsCount} objects`),
    ).toBeInTheDocument();
  });

  it("lists every achievement", () => {
    const caseItem = renderPage();
    const list = screen.getByRole("list");

    expect(within(list).getAllByRole("listitem")).toHaveLength(
      caseItem.achievements.length,
    );
    for (const { description } of caseItem.achievements) {
      expect(within(list).getByText(description)).toBeInTheDocument();
    }
  });

  it("opens the project in a new tab with a descriptive name", () => {
    const caseItem = renderPage();
    const link = screen.getByRole("link", {
      name: `Project link: ${caseItem.name}`,
    });

    expect(link).toHaveAttribute("href", caseItem.projectLink);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("links back to the cases list in the same locale", () => {
    renderPage();

    expect(screen.getByRole("link", { name: "Back to cases" })).toHaveAttribute(
      "href",
      "/en/cases",
    );
  });
});
