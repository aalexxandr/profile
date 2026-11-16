"use client";

import { type RefObject, useEffect, useState } from "react";

import { getReservedHeight, type WindowMeasure } from "./getReservedHeight";

// The height the observed element has when it is fully expanded, or
// undefined until it is measured (or when ResizeObserver is unavailable).
export const useReservedHeight = (ref: RefObject<Element | null>) => {
  const [measure, setMeasure] = useState<WindowMeasure | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries.at(-1);

      if (!entry) {
        return;
      }

      const { height, width } = entry.contentRect;

      setMeasure((previous) => getReservedHeight(previous, { height, width }));
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return measure?.height;
};
