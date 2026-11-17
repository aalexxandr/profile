import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SUCCESS_NOTICE_TIME_MS } from "../config";
import { useSuccessNotice } from "./useSuccessNotice";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

describe("useSuccessNotice", () => {
  it("is hidden at first", () => {
    const { result } = renderHook(() => useSuccessNotice());

    expect(result.current.isVisible).toBe(false);
  });

  it("shows the notice", () => {
    const { result } = renderHook(() => useSuccessNotice());

    act(() => result.current.show());

    expect(result.current.isVisible).toBe(true);
  });

  it("hides the notice after its display time", () => {
    const { result } = renderHook(() => useSuccessNotice());

    act(() => result.current.show());
    advance(SUCCESS_NOTICE_TIME_MS - 1);
    expect(result.current.isVisible).toBe(true);

    advance(1);
    expect(result.current.isVisible).toBe(false);
  });

  it("restarts the display time on a repeat", () => {
    const { result } = renderHook(() => useSuccessNotice());

    act(() => result.current.show());
    advance(SUCCESS_NOTICE_TIME_MS - 1000);
    act(() => result.current.show());
    advance(SUCCESS_NOTICE_TIME_MS - 1);

    expect(result.current.isVisible).toBe(true);

    advance(1);
    expect(result.current.isVisible).toBe(false);
  });

  it("clears the timer on unmount", () => {
    const { result, unmount } = renderHook(() => useSuccessNotice());

    act(() => result.current.show());
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
