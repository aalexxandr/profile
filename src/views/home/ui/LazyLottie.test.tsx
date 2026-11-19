import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lottieModuleLoaded = vi.fn();

vi.mock("lottie-react", () => {
  lottieModuleLoaded();

  return {
    Lottie: ({ className }: { className?: string }) => (
      <div data-testid="lottie" className={className} />
    ),
  };
});

const stubWidth = (matches: boolean) =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches })),
  );

// React.lazy keeps the loader's result, so each test gets a fresh module.
const importLazyLottie = async () => {
  vi.resetModules();

  return (await import("./LazyLottie")).LazyLottie;
};

beforeEach(() => lottieModuleLoaded.mockClear());
afterEach(() => vi.unstubAllGlobals());

describe("LazyLottie", () => {
  it("loads lottie-react on demand on a wide screen and passes the props", async () => {
    stubWidth(true);
    const LazyLottie = await importLazyLottie();

    render(<LazyLottie src={{}} className="size-full" />);

    expect(await screen.findByTestId("lottie")).toHaveClass("size-full");
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 64rem)");
  });

  it("renders nothing and never loads the library below the lg breakpoint", async () => {
    stubWidth(false);
    const LazyLottie = await importLazyLottie();

    const { container } = render(<LazyLottie src={{}} />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container).toBeEmptyDOMElement();
    expect(lottieModuleLoaded).not.toHaveBeenCalled();
  });
});
