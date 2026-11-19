import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SHELVES_MIN_WIDTH_QUERY } from "../config";

import { ShelvesImage } from "./ShelvesImage";

vi.mock("./assets/shelves.svg", () => ({
  default: { src: "/shelves.svg", width: 120, height: 340 },
}));

describe("ShelvesImage", () => {
  it("offers the real picture only from the lg breakpoint", () => {
    const { container } = render(<ShelvesImage alt="Shelves" />);

    const source = container.querySelector("source");

    expect(source).toHaveAttribute("media", SHELVES_MIN_WIDTH_QUERY);
    expect(source).toHaveAttribute("srcset", "/shelves.svg");
    expect(SHELVES_MIN_WIDTH_QUERY).toBe("(min-width: 1024px)");
  });

  it("falls back to a tiny inline placeholder, so phones never download the picture", () => {
    render(<ShelvesImage alt="Shelves" />);

    const img = screen.getByAltText("Shelves");

    expect(img.getAttribute("src")).toMatch(/^data:image\//);
    expect(img.getAttribute("src")).not.toContain("shelves.svg");
  });

  it("loads at once with high priority and reserves the picture's size", () => {
    render(<ShelvesImage alt="Shelves" />);

    const img = screen.getByAltText("Shelves");

    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img).toHaveAttribute("width", "120");
    expect(img).toHaveAttribute("height", "340");
  });
});
