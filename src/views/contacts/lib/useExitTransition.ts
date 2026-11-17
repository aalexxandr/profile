"use client";

import { useEffect, useState } from "react";

// Keeps something mounted for `durationMs` after `isVisible` turns false so
// it can play an exit animation before it leaves the DOM.
export const useExitTransition = (isVisible: boolean, durationMs: number) => {
  const [isRendered, setIsRendered] = useState(isVisible);

  if (isVisible && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const timerId = setTimeout(() => setIsRendered(false), durationMs);

    return () => clearTimeout(timerId);
  }, [isVisible, durationMs]);

  return { isLeaving: !isVisible, isRendered: isVisible || isRendered };
};
