"use client";

import { useSyncExternalStore } from "react";

import { FINE_HOVER_QUERY, REDUCED_MOTION_QUERY } from "./mediaQueries";

// "follow": trails a hovering mouse; "static": sits still in the viewport
// centre (touch screens have no pointer to follow); "off": a mouse user asked
// for reduced motion.
export type GlowMode = "follow" | "static" | "off";

const QUERIES = [FINE_HOVER_QUERY, REDUCED_MOTION_QUERY];

const subscribe = (onChange: () => void) => {
  const lists = QUERIES.map((query) => window.matchMedia(query));

  lists.forEach((list) => list.addEventListener("change", onChange));

  return () => {
    lists.forEach((list) => list.removeEventListener("change", onChange));
  };
};

const getSnapshot = (): GlowMode => {
  if (!window.matchMedia(FINE_HOVER_QUERY).matches) {
    return "static";
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "off" : "follow";
};

// The server and the first client render agree on "off"; the preference then
// applies, and later changes apply without a reload.
const getServerSnapshot = (): GlowMode => "off";

export const useGlowMode = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
