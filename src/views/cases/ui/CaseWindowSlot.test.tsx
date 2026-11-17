import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CaseWindowSlot } from "./CaseWindowSlot";

type ResizeCallback = (entries: ResizeObserverEntry[]) => void;

let callback: ResizeCallback | undefined;

class MockResizeObserver {
  constructor(onResize: ResizeCallback) {
    callback = onResize;
  }
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}

describe("CaseWindowSlot", () => {
  beforeEach(() => {
    callback = undefined;
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders its children", () => {
    render(<CaseWindowSlot>window</CaseWindowSlot>);

    expect(screen.getByText("window")).toBeInTheDocument();
  });

  it("reserves the measured height only on wide screens", () => {
    render(<CaseWindowSlot>window</CaseWindowSlot>);
    const slot = screen.getByText("window").parentElement;

    expect(slot).toHaveClass("lg:min-h-(--case-window-height)");

    act(() => {
      callback?.([
        { contentRect: { height: 320, width: 640 } } as ResizeObserverEntry,
      ]);
    });

    expect(slot).toHaveStyle({ "--case-window-height": "320px" });
  });

  it("sets no height before it is measured", () => {
    render(<CaseWindowSlot>window</CaseWindowSlot>);

    expect(
      screen.getByText("window").parentElement?.getAttribute("style"),
    ).toBeNull();
  });
});
