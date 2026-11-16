import type { CSSProperties } from "react";

export const getRevealStyle = (delay: number): CSSProperties | undefined =>
  delay > 0 ? { animationDelay: `${delay}ms` } : undefined;
