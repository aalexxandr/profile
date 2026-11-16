import type { LottieHandle } from "lottie-react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAlternatingDirection } from "./useAlternatingDirection";

const attachHandle = (
  result: ReturnType<
    typeof renderHook<ReturnType<typeof useAlternatingDirection>, unknown>
  >["result"],
) => {
  const handle = { setDirection: vi.fn(), play: vi.fn() };

  result.current.lottieRef.current = handle as unknown as LottieHandle;

  return handle;
};

describe("useAlternatingDirection", () => {
  it("does nothing until the animation completes", () => {
    const { result } = renderHook(() => useAlternatingDirection());
    const handle = attachHandle(result);

    expect(handle.setDirection).not.toHaveBeenCalled();
    expect(handle.play).not.toHaveBeenCalled();
  });

  it("plays backward after the first completion", () => {
    const { result } = renderHook(() => useAlternatingDirection());
    const handle = attachHandle(result);

    result.current.subscriptions.complete();

    expect(handle.setDirection).toHaveBeenCalledWith("reverse");
    expect(handle.play).toHaveBeenCalledTimes(1);
  });

  it("alternates the direction on every completion", () => {
    const { result } = renderHook(() => useAlternatingDirection());
    const handle = attachHandle(result);

    for (let pass = 0; pass < 4; pass += 1) {
      result.current.subscriptions.complete();
    }

    expect(
      handle.setDirection.mock.calls.map(([direction]) => direction),
    ).toEqual(["reverse", "forward", "reverse", "forward"]);
    expect(handle.play).toHaveBeenCalledTimes(4);
  });

  it("sets the direction before it starts playing", () => {
    const { result } = renderHook(() => useAlternatingDirection());
    const handle = attachHandle(result);

    result.current.subscriptions.complete();

    const [setOrder] = handle.setDirection.mock.invocationCallOrder;
    const [playOrder] = handle.play.mock.invocationCallOrder;

    expect(setOrder).toBeLessThan(playOrder ?? 0);
  });

  it("keeps the same subscriptions between renders", () => {
    const { result, rerender } = renderHook(() => useAlternatingDirection());
    const first = result.current.subscriptions;

    rerender();

    expect(result.current.subscriptions).toBe(first);
  });

  it("does not fail when the animation is not mounted yet", () => {
    const { result } = renderHook(() => useAlternatingDirection());

    expect(() => result.current.subscriptions.complete()).not.toThrow();
  });
});
