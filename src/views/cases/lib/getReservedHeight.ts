export type WindowMeasure = { height: number; width: number };

// Collapsing a window only lowers its height, never its width, so a lower
// height at the same width is ignored. A different width means another
// breakpoint and starts over.
export const getReservedHeight = (
  previous: WindowMeasure | null,
  next: WindowMeasure,
): WindowMeasure =>
  previous && previous.width === next.width && previous.height > next.height
    ? previous
    : next;
