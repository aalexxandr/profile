"use client";

import { useCursorGlow } from "./useCursorGlow";

export const CursorGlow = () => {
  const { glowRef, isEnabled } = useCursorGlow();

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-1 overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 size-175 rounded-full bg-glow-spot opacity-0 transition-opacity duration-700 will-change-transform"
        data-testid="cursor-glow"
        ref={glowRef}
      />
    </div>
  );
};
