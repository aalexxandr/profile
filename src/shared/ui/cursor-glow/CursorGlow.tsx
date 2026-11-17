"use client";

import { useCursorGlow } from "./useCursorGlow";

type CursorGlowProps = {
  // Id of an element the glow must not cover: it is cut at that element's
  // bottom edge (see getGlowTarget and getGlowEdgeMask).
  boundaryId?: string;
};

export const CursorGlow = ({ boundaryId }: CursorGlowProps) => {
  const { glowRef, isEnabled, layerRef } = useCursorGlow(boundaryId);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-1 overflow-hidden"
      ref={layerRef}
    >
      <div
        className="absolute top-0 left-0 size-175 rounded-full bg-glow-spot opacity-0 transition-opacity duration-700 will-change-transform"
        data-testid="cursor-glow"
        ref={glowRef}
      />
    </div>
  );
};
