import { act, render } from "@testing-library/react";
import Link from "next/link";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PageKey } from "@/shared/i18n";

import { useActiveNavigationIndicator } from "./useActiveNavigationIndicator";

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  disconnect = vi.fn();
  observe = vi.fn();

  constructor(private readonly callback: () => void) {
    FakeResizeObserver.instances.push(this);
  }

  trigger() {
    this.callback();
  }
}

type Rect = { left: number; width: number };

let navRect: Rect;
let linkRect: Rect;
type HookResult = ReturnType<typeof useActiveNavigationIndicator>;

const latest: {
  indicator: HookResult["navigationIndicator"];
  isMeasured: boolean;
} = { indicator: null, isMeasured: false };

const Harness = ({
  activePage,
  onResult,
}: {
  activePage: PageKey | null;
  onResult: (result: HookResult) => void;
}) => {
  const result = useActiveNavigationIndicator({ activePage });
  const { activeLinkRef, navRef } = result;

  onResult(result);

  return (
    <nav ref={navRef}>
      <Link href="/ru" ref={activePage ? activeLinkRef : undefined}>
        link
      </Link>
    </nav>
  );
};

const record = ({ isIndicatorMeasured, navigationIndicator }: HookResult) => {
  latest.indicator = navigationIndicator;
  latest.isMeasured = isIndicatorMeasured;
};

const renderHarness = (activePage: PageKey | null) => {
  const view = render(<Harness activePage={activePage} onResult={record} />);

  return {
    ...view,
    rerenderWith: (nextPage: PageKey | null) =>
      view.rerender(<Harness activePage={nextPage} onResult={record} />),
  };
};

const triggerResize = () => {
  act(() => {
    FakeResizeObserver.instances.at(-1)?.trigger();
  });
};

beforeEach(() => {
  navRect = { left: 10, width: 400 };
  linkRect = { left: 25.123, width: 80.456 };
  FakeResizeObserver.instances = [];

  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const { left, width } = this.tagName === "NAV" ? navRect : linkRect;

      return DOMRect.fromRect({ width, x: left });
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("useActiveNavigationIndicator", () => {
  it("has no indicator when there is no active page", () => {
    renderHarness(null);

    expect(latest.indicator).toBeNull();
    expect(latest.isMeasured).toBe(false);
    expect(FakeResizeObserver.instances).toHaveLength(0);
  });

  it("measures the active link relative to the nav and rounds to 2 decimals", () => {
    renderHarness("cases");

    expect(latest.indicator).toEqual({ width: 80.46, x: 15.12 });
    expect(latest.isMeasured).toBe(true);
  });

  it("observes both the nav and the active link", () => {
    const { container } = renderHarness("cases");
    const [observer] = FakeResizeObserver.instances;

    expect(observer?.observe).toHaveBeenCalledWith(
      container.querySelector("nav"),
    );
    expect(observer?.observe).toHaveBeenCalledWith(
      container.querySelector("a"),
    );
  });

  it("keeps the same indicator object when a resize leaves the size unchanged", () => {
    renderHarness("cases");
    const indicatorAfterMount = latest.indicator;

    triggerResize();
    triggerResize();

    expect(latest.indicator).toBe(indicatorAfterMount);
  });

  it("updates the indicator when the layout changes", () => {
    renderHarness("cases");

    linkRect = { left: 110, width: 60 };
    triggerResize();

    expect(latest.indicator).toEqual({ width: 60, x: 100 });
  });

  it("remeasures when the active page changes", () => {
    const { rerenderWith } = renderHarness("home");

    linkRect = { left: 50, width: 70 };
    rerenderWith("cases");

    expect(latest.indicator).toEqual({ width: 70, x: 40 });
  });

  it("drops the indicator when the page stops being active", () => {
    const { rerenderWith } = renderHarness("cases");

    rerenderWith(null);

    expect(latest.indicator).toBeNull();
    expect(latest.isMeasured).toBe(false);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderHarness("cases");
    const [observer] = FakeResizeObserver.instances;

    unmount();

    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });

  it("still measures when ResizeObserver is unavailable", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    renderHarness("cases");

    expect(latest.indicator).toEqual({ width: 80.46, x: 15.12 });
  });
});
