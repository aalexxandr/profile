"use client";

import clsx from "clsx";

import { useCursorGlow } from "./useCursorGlow";

export const CursorGlow = () => {
  const { glowRef, mode } = useCursorGlow();

  if (mode === "off") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-1 overflow-hidden"
    >
      <div
        className={clsx(
          "absolute size-175 rounded-full bg-glow-spot",
          mode === "static"
            ? "top-1/2 left-1/2 -translate-1/2 animate-reveal-fade"
            : "top-0 left-0 opacity-0 transition-opacity duration-700 will-change-transform",
        )}
        data-testid="cursor-glow"
        ref={glowRef}
      />
    </div>
  );
};
