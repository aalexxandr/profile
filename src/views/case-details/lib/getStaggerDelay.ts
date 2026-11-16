const FIRST_ITEM_DELAY_MS = 120;
const STEP_MS = 80;
const MAX_DELAY_MS = 600;

// Entrance delay of a list item, so items follow one another without the
// tail of a long list waiting too long.
export const getStaggerDelay = (index: number) =>
  Math.min(FIRST_ITEM_DELAY_MS + index * STEP_MS, MAX_DELAY_MS);
