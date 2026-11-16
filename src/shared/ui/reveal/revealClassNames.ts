export type RevealDirection = "up" | "down" | "left" | "right" | "fade";

export const animationClassNameByDirection: Record<RevealDirection, string> = {
  down: "animate-reveal-down",
  fade: "animate-reveal-fade",
  left: "animate-reveal-left",
  right: "animate-reveal-right",
  up: "animate-reveal-up",
};

// Under reduced motion the block is shown at its final state at once.
export const REVEAL_BASE_CLASS_NAME =
  "motion-reduce:animate-none motion-reduce:opacity-100";

// Holds the keyframe (and its delay) at the hidden start state until revealed.
export const REVEAL_PAUSED_CLASS_NAME = "[animation-play-state:paused]";
