import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRetroWindowAnimation } from "./useRetroWindowAnimation";

const CHANGE_SIZE_DURATION = 800;
const CLOSE_DURATION = 1000;

const setup = () => renderHook(() => useRetroWindowAnimation());

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useRetroWindowAnimation", () => {
  it("starts with every animation switched off", () => {
    const { result } = setup();

    expect(result.current.state).toEqual({
      isClosed: false,
      isCollapsed: false,
      isJello: false,
      isShaking: false,
    });
  });

  describe("toggleCollapse", () => {
    it("collapses an expanded window", () => {
      const { result } = setup();

      act(() => result.current.toggleCollapse());

      expect(result.current.state.isCollapsed).toBe(true);
      expect(result.current.state.isShaking).toBe(false);
    });

    it("shakes a collapsed window for 800ms and keeps it collapsed", () => {
      const { result } = setup();

      act(() => result.current.toggleCollapse());
      act(() => result.current.toggleCollapse());

      expect(result.current.state.isShaking).toBe(true);
      expect(result.current.state.isCollapsed).toBe(true);

      advance(CHANGE_SIZE_DURATION - 1);
      expect(result.current.state.isShaking).toBe(true);

      advance(1);
      expect(result.current.state.isShaking).toBe(false);
      expect(result.current.state.isCollapsed).toBe(true);
    });
  });

  describe("toggleFullScreen", () => {
    it("expands a collapsed window without the jello animation", () => {
      const { result } = setup();

      act(() => result.current.toggleCollapse());
      act(() => result.current.toggleFullScreen());

      expect(result.current.state.isCollapsed).toBe(false);
      expect(result.current.state.isJello).toBe(false);
    });

    it("plays the jello animation for 800ms on an expanded window", () => {
      const { result } = setup();

      act(() => result.current.toggleFullScreen());
      expect(result.current.state.isJello).toBe(true);

      advance(CHANGE_SIZE_DURATION - 1);
      expect(result.current.state.isJello).toBe(true);

      advance(1);
      expect(result.current.state.isJello).toBe(false);
    });

    it("restarts the animation instead of stacking timers on repeated clicks", () => {
      const { result } = setup();

      act(() => result.current.toggleFullScreen());
      advance(400);
      act(() => result.current.toggleFullScreen());

      expect(vi.getTimerCount()).toBe(1);

      advance(CHANGE_SIZE_DURATION - 1);
      expect(result.current.state.isJello).toBe(true);

      advance(1);
      expect(result.current.state.isJello).toBe(false);
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe("closeWindow", () => {
    it("plays the close animation and resets after 1000ms", () => {
      const { result } = setup();

      act(() => result.current.closeWindow());
      expect(result.current.state.isClosed).toBe(true);

      advance(CLOSE_DURATION - 1);
      expect(result.current.state.isClosed).toBe(true);

      advance(1);
      expect(result.current.state.isClosed).toBe(false);
    });

    it("stops the other animations right away", () => {
      const { result } = setup();

      act(() => result.current.toggleFullScreen());
      expect(result.current.state.isJello).toBe(true);

      act(() => result.current.closeWindow());

      expect(result.current.state.isJello).toBe(false);
      expect(result.current.state.isShaking).toBe(false);
    });

    it("expands a collapsed window once the close animation is over", () => {
      const { result } = setup();

      act(() => result.current.toggleCollapse());
      act(() => result.current.closeWindow());
      expect(result.current.state.isCollapsed).toBe(true);

      advance(CLOSE_DURATION);

      expect(result.current.state.isCollapsed).toBe(false);
      expect(result.current.state.isClosed).toBe(false);
    });
  });

  it("clears pending timers on unmount", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result, unmount } = setup();

    act(() => result.current.closeWindow());
    act(() => result.current.toggleFullScreen());
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(CLOSE_DURATION);
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
