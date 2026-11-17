// Diameter of the glow element in px.
export const GLOW_SIZE = 700;

// Time constant (ms) of the glow's lag behind the pointer: about this long
// after a jump the glow has covered 63% of the way.
export const GLOW_LAG_MS = 220;

// A frame longer than this (ms) counts as this long, so a stalled tab does
// not teleport the glow.
export const GLOW_MAX_FRAME_MS = 100;

// Closer than this (px) the glow lands on the target and the loop idles.
export const GLOW_SNAP_DISTANCE = 0.5;

// Length (px) of the soft edge below a boundary.
export const GLOW_EDGE_FADE = 100;
