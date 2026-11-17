import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useReservedHeight } from "./useReservedHeight";

type ResizeCallback = (entries: ResizeObserverEntry[]) => void;

let callback: ResizeCallback | undefined;
const disconnect = vi.fn();

class MockResizeObserver {
  constructor(onResize: ResizeCallback) {
    callback = onResize;
  }
  disconnect = disconnect;
  observe = vi.fn();
  unobserve = vi.fn();
}

const resizeTo = (width: number, height: number) => {
  act(() => {
    callback?.([{ contentRect: { height, width } } as ResizeObserverEntry]);
  });
};

const renderReservedHeight = () => {
  const ref = { current: document.createElement("div") };

  return renderHook(() => useReservedHeight(ref));
};

describe("useReservedHeight", () => {
  beforeEach(() => {
    callback = undefined;
    disconnect.mockClear();
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reserves nothing before the first measurement", () => {
    const { result } = renderReservedHeight();

    expect(result.current).toBeUndefined();
  });

  it("reports the measured height", () => {
    const { result } = renderReservedHeight();

    resizeTo(640, 300);

    expect(result.current).toBe(300);
  });

  it("keeps the largest height while the width stays the same", () => {
    const { result } = renderReservedHeight();

    resizeTo(640, 300);
    resizeTo(640, 40);

    expect(result.current).toBe(300);
  });

  it("grows when the content grows at the same width", () => {
    const { result } = renderReservedHeight();

    resizeTo(640, 300);
    resizeTo(640, 340);

    expect(result.current).toBe(340);
  });

  it("starts over when the width changes", () => {
    const { result } = renderReservedHeight();

    resizeTo(640, 300);
    resizeTo(400, 260);

    expect(result.current).toBe(260);
  });

  it("reserves nothing without ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    const { result } = renderReservedHeight();

    expect(result.current).toBeUndefined();
  });

  it("stops observing on unmount", () => {
    const { unmount } = renderReservedHeight();

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
