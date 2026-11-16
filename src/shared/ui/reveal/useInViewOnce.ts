"use client";

import {
  type RefObject,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { isFarEnoughInView, MIN_VISIBLE_RATIO } from "./isFarEnoughInView";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px",
  // 0 reports the first pixel (and leaving); the second step reports a fifth.
  threshold: [0, MIN_VISIBLE_RATIO],
};

const subscribeToNothing = () => () => {};
const canObserve = () => typeof IntersectionObserver !== "undefined";
const canObserveOnServer = () => true;

// True from the first time the element is far enough in the viewport (see
// isFarEnoughInView); never goes back.
// Without IntersectionObserver the element counts as visible at once.
export const useInViewOnce = (ref: RefObject<Element | null>) => {
  const [hasEntered, setHasEntered] = useState(false);
  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    canObserve,
    canObserveOnServer,
  );

  useEffect(() => {
    const element = ref.current;

    if (!isSupported || !element) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some(isFarEnoughInView)) {
        setHasEntered(true);
        observer.disconnect();
      }
    }, OBSERVER_OPTIONS);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isSupported, ref]);

  return hasEntered || !isSupported;
};
