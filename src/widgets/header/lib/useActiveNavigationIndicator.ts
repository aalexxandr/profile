import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type { PageKey } from "@/shared/i18n";

type NavigationIndicator = null | {
  width: number;
  x: number;
};

type UseActiveNavigationIndicatorParams = {
  activePage: PageKey | null;
};

const roundLayoutValue = (value: number) => Math.round(value * 100) / 100;

const getIsSameIndicator = (
  current: NavigationIndicator,
  next: NavigationIndicator,
) => {
  if (current === null || next === null) {
    return current === next;
  }

  return current.width === next.width && current.x === next.x;
};

export const useActiveNavigationIndicator = ({
  activePage,
}: UseActiveNavigationIndicatorParams) => {
  const navRef = useRef<HTMLElement | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [indicator, setIndicator] = useState<NavigationIndicator>(null);

  const measureIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeLink = activeLinkRef.current;

    if (!activePage || !nav || !activeLink) {
      setIndicator((currentIndicator) =>
        getIsSameIndicator(currentIndicator, null) ? currentIndicator : null,
      );
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const nextIndicator: NavigationIndicator = {
      width: roundLayoutValue(linkRect.width),
      x: roundLayoutValue(linkRect.left - navRect.left),
    };

    setIndicator((currentIndicator) =>
      getIsSameIndicator(currentIndicator, nextIndicator)
        ? currentIndicator
        : nextIndicator,
    );
  }, [activePage]);

  useLayoutEffect(() => {
    measureIndicator();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const nav = navRef.current;
    const activeLink = activeLinkRef.current;

    if (!nav || !activeLink) {
      return;
    }

    const resizeObserver = new ResizeObserver(measureIndicator);

    resizeObserver.observe(nav);
    resizeObserver.observe(activeLink);

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureIndicator]);

  const isIndicatorMeasured = indicator !== null;
  return {
    activeLinkRef,
    isIndicatorMeasured,
    navRef,
    navigationIndicator: indicator,
  };
};
