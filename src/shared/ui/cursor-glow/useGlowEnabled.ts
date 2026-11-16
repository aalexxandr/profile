"use client";

import { useSyncExternalStore } from "react";

import { FINE_HOVER_QUERY, REDUCED_MOTION_QUERY } from "./mediaQueries";

const QUERIES = [FINE_HOVER_QUERY, REDUCED_MOTION_QUERY];

const subscribe = (onChange: () => void) => {
  const lists = QUERIES.map((query) => window.matchMedia(query));

  lists.forEach((list) => list.addEventListener("change", onChange));

  return () => {
    lists.forEach((list) => list.removeEventListener("change", onChange));
  };
};

const getSnapshot = () =>
  window.matchMedia(FINE_HOVER_QUERY).matches &&
  !window.matchMedia(REDUCED_MOTION_QUERY).matches;

// The server and the first client render agree on "off"; the preference then
// applies, and later changes apply without a reload.
const getServerSnapshot = () => false;

// A hovering fine pointer and no request for reduced motion.
export const useGlowEnabled = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
