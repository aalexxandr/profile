import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ImageWithFallback } from "./ImageWithFallback";

type MockImageProps = {
  alt: string;
  blurDataURL?: string;
  placeholder?: string;
  src: string;
};

vi.mock("next/image", () => ({
  default: ({ alt, blurDataURL, placeholder, src }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      data-blur={blurDataURL}
      data-placeholder={placeholder}
      src={src}
    />
  ),
}));

const props = {
  alt: "Project",
  fallback: "No image",
  height: 430,
  width: 520,
};

describe("ImageWithFallback", () => {
  it("shows the picture with its alternative text", () => {
    render(<ImageWithFallback {...props} src="https://cdn.test/a.webp" />);

    expect(screen.getByRole("img", { name: "Project" })).toHaveAttribute(
      "src",
      "https://cdn.test/a.webp",
    );
    expect(screen.queryByText("No image")).not.toBeInTheDocument();
  });

  it("uses the blur placeholder when a blur preview is given", () => {
    render(
      <ImageWithFallback
        {...props}
        blurSrc="data:image/png;base64,AAAA"
        src="https://cdn.test/a.webp"
      />,
    );

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("data-placeholder", "blur");
    expect(image).toHaveAttribute("data-blur", "data:image/png;base64,AAAA");
  });

  it("loads without a placeholder when there is no blur preview", () => {
    render(
      <ImageWithFallback
        {...props}
        blurSrc={null}
        src="https://cdn.test/a.webp"
      />,
    );

    expect(screen.getByRole("img")).not.toHaveAttribute("data-placeholder");
  });

  it("shows the fallback text and no image when the source is null", () => {
    render(<ImageWithFallback {...props} src={null} />);

    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
