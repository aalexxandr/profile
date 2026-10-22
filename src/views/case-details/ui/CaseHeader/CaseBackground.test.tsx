import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CaseBackground } from "./CaseBackground";

type MockImageProps = { alt: string; blurDataURL?: string; src: string };

vi.mock("next/image", () => ({
  default: ({ alt, blurDataURL, src }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} data-blur={blurDataURL} src={src} />
  ),
}));

const renderBackground = (
  props: Partial<Parameters<typeof CaseBackground>[0]> = {},
) =>
  render(
    <CaseBackground
      backgroundBlurImage="data:image/png;base64,BBBB"
      backgroundImage="https://cdn.test/spectre-background.webp"
      {...props}
    />,
  );

const getLayer = (container: HTMLElement) =>
  container.querySelector("img")?.parentElement?.parentElement;

describe("CaseBackground", () => {
  it("shows the decorative picture with a blur preview", () => {
    const { container } = renderBackground();
    const image = container.querySelector("img");

    expect(image).toHaveAttribute(
      "src",
      "https://cdn.test/spectre-background.webp",
    );
    expect(image).toHaveAttribute("data-blur", "data:image/png;base64,BBBB");
    expect(image).toHaveAttribute("alt", "");
  });

  it("loads the picture without a blur preview when it is null", () => {
    const { container } = renderBackground({ backgroundBlurImage: null });

    expect(container.querySelector("img")).not.toHaveAttribute("data-blur");
  });

  it("renders nothing without a picture", () => {
    const { container } = renderBackground({
      backgroundBlurImage: null,
      backgroundImage: null,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it("is anchored to the top of the page, behind the site menu", () => {
    const { container } = renderBackground();
    const layer = getLayer(container);

    expect(layer).toHaveClass("absolute", "inset-x-0", "top-0", "-z-10");
    expect(layer).toHaveAttribute("aria-hidden", "true");
  });

  it("dissolves the top and the bottom of the picture with a mask", () => {
    const { container } = renderBackground();
    const picture = container.querySelector("img")?.parentElement;

    expect(picture?.className).toContain(
      "mask-[linear-gradient(to_bottom,transparent",
    );
    expect(picture?.className).not.toContain("bg-linear");
  });

  it("darkens the top under the menu with a separate scrim", () => {
    const { container } = renderBackground();
    const scrim = getLayer(container)?.lastElementChild;

    expect(scrim).toHaveClass("top-0", "bg-linear-to-b");
    expect(scrim).not.toContainElement(container.querySelector("img"));
  });
});
