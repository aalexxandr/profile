"use client";

import { useCallback, useEffect, useState } from "react";

import { SUCCESS_NOTICE_TIME_MS } from "../config";

export const useSuccessNotice = () => {
  // Bumped on every `show` so a repeat restarts the hide timer.
  const [shownCount, setShownCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timerId = setTimeout(
      () => setIsVisible(false),
      SUCCESS_NOTICE_TIME_MS,
    );

    return () => clearTimeout(timerId);
  }, [isVisible, shownCount]);

  const show = useCallback(() => {
    setIsVisible(true);
    setShownCount((count) => count + 1);
  }, []);

  return { isVisible, show };
};
