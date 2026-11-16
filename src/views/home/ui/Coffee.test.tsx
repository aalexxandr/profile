import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import coffee from "./assets/lottie-animations/coffee-cup.json";
import { Coffee } from "./Coffee";

const { Lottie } = vi.hoisted(() => ({
  Lottie: vi.fn<(props: Record<string, unknown>) => null>(() => null),
}));

vi.mock("lottie-react", () => ({ Lottie }));

const lastProps = () => Lottie.mock.lastCall?.[0];

describe("Coffee", () => {
  it("plays the coffee cup animation by itself and loops it", () => {
    render(<Coffee />);

    expect(lastProps()).toMatchObject({
      src: coffee,
      loop: true,
      autoplay: true,
    });
  });

  it("passes the class name to the animation container", () => {
    render(<Coffee className="size-full" />);

    expect(lastProps()).toMatchObject({ className: "size-full" });
  });
});
