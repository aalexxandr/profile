import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { en } from "@/shared/i18n-server/dictionaries/en";

import { HomePage } from "./HomePage";

type MockImageProps = { alt: string };

vi.mock("next/image", () => ({
  default: ({ alt }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} />
  ),
}));
vi.mock("./LazyLottie", () => ({ LazyLottie: () => null }));

describe("HomePage", () => {
  // The shelves are the LCP element on desktop and are hidden on phones, so
  // they go through <picture> (loaded at once, only from lg), not next/image.
  it("renders the shelves as a picture that is eager and offered only to wide screens", () => {
    render(<HomePage ctaHref="/en/cases" home={en.home} />);

    const shelves = screen.getByAltText(en.home.imageAlts.shelves);

    expect(shelves.closest("picture")).not.toBeNull();
    expect(shelves).toHaveAttribute("loading", "eager");
  });
});
