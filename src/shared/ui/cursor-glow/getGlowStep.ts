import {
  GLOW_LAG_MS,
  GLOW_MAX_FRAME_MS,
  GLOW_SNAP_DISTANCE,
} from "./constants";

// One animation frame of the glow's lag behind its target on one axis.
// Exponential smoothing over real time, so the lag is the same on 60 and
// 120 Hz displays.
export const getGlowStep = (
  current: number,
  target: number,
  frameMs: number,
) => {
  const distance = target - current;

  if (Math.abs(distance) < GLOW_SNAP_DISTANCE) {
    return target;
  }

  const elapsed = Math.min(frameMs, GLOW_MAX_FRAME_MS);

  return current + distance * (1 - Math.exp(-elapsed / GLOW_LAG_MS));
};
