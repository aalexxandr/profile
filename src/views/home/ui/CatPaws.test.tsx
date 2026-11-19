import { render } from "@testing-library/react";
import type { LottieHandle } from "lottie-react";
import { describe, expect, it, vi } from "vitest";

import paws from "./assets/lottie-animations/cat-paws.json";
import { CatPaws } from "./CatPaws";

type LottieProps = {
  src: unknown;
  loop: boolean;
  autoplay: boolean;
  className?: string;
  lottieRef: { current: LottieHandle | null };
  subscriptions: { complete: () => void };
};

const { Lottie } = vi.hoisted(() => ({
  Lottie: vi.fn<(props: LottieProps) => null>(() => null),
}));

vi.mock("./LazyLottie", () => ({ LazyLottie: Lottie }));

const lastProps = () => {
  const props = Lottie.mock.lastCall?.[0];

  if (!props) {
    throw new Error("Lottie was not rendered");
  }

  return props;
};

describe("CatPaws", () => {
  it("plays the paws animation once by itself and does not loop on its own", () => {
    render(<CatPaws />);

    expect(lastProps()).toMatchObject({
      src: paws,
      loop: false,
      autoplay: true,
    });
  });

  it("passes the class name to the animation container", () => {
    render(<CatPaws className="w-full" />);

    expect(lastProps()).toMatchObject({ className: "w-full" });
  });

  it("plays the animation in the opposite direction when a pass completes", () => {
    render(<CatPaws />);

    const { lottieRef, subscriptions } = lastProps();
    const handle = { setDirection: vi.fn(), play: vi.fn() };

    lottieRef.current = handle as unknown as LottieHandle;
    subscriptions.complete();
    subscriptions.complete();

    expect(handle.setDirection.mock.calls).toEqual([["reverse"], ["forward"]]);
    expect(handle.play).toHaveBeenCalledTimes(2);
  });
});
