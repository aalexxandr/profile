export type GlowPoint = { x: number; y: number };

// Where the glow centre should head for. A boundary (the bottom edge of the
// element the glow must not cover, in viewport px) keeps the centre from
// rising above that edge; what the glow would draw above it is cut off
// separately (see getGlowEdgeMask).
export const getGlowTarget = (
  pointer: GlowPoint,
  boundaryBottom: number | null,
): GlowPoint => {
  if (boundaryBottom === null) {
    return pointer;
  }

  return { x: pointer.x, y: Math.max(pointer.y, boundaryBottom) };
};
