import { GLOW_EDGE_FADE } from "./constants";

// CSS mask for the glow layer: nothing above the boundary edge (viewport px),
// the glow fading in over GLOW_EDGE_FADE px below it. Null without a
// boundary. The edge is rounded so sub-pixel scroll steps do not rewrite it.
export const getGlowEdgeMask = (boundaryBottom: number | null) => {
  if (boundaryBottom === null) {
    return null;
  }

  const edge = Math.round(boundaryBottom);

  return `linear-gradient(to bottom, transparent ${edge}px, #000 ${edge + GLOW_EDGE_FADE}px)`;
};
