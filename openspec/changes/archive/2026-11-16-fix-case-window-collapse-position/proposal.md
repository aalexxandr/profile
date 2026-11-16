## Why

On the cases list (desktop, `lg` and up) the picture and the case window sit in one row and are centred vertically. Collapsing a window shrinks its height, so the row re-centres it and the title bar with the "Minimize / Maximize / Close" buttons slides down to the middle of the row. The bar the user just clicked moves away from the cursor and the layout looks broken. The bar must stay where it was.

## What Changes

- On `lg` and up, the window slot of a case block keeps the height of the expanded window while the window is collapsed. The window is pinned to the top of that slot, so its title bar does not move when collapsing or expanding.
- The expanded layout does not change: the slot is still centred next to the picture exactly as today.
- Below `lg` (picture above the window) nothing is reserved: the page still shrinks when a window is collapsed.
- The slot remembers the largest height measured at the current window width, so it follows breakpoint changes and font loading but ignores the temporary shrinking caused by collapsing.
- `RetroWindow` (shared by the home page) is not changed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cases-catalog`: adds a requirement that collapsing a case window does not move its title bar on wide screens.

## Impact

- Code: `src/views/cases/ui/CaseBlock.tsx` (wraps the window in a new slot), new `src/views/cases/ui/CaseWindowSlot.tsx` and hook `src/views/cases/lib/useReservedHeight.ts` (+ unit tests).
- Tests: Vitest for the hook and the slot, Playwright E2E in `e2e/cases-window.spec.ts` (title bar position before/after collapse on desktop and mobile).
- Docs: one sentence in `CLAUDE.md` architecture notes about the slot.
- No API, dependency, i18n or dictionary changes.

## Out of Scope

- Redesigning the window or its collapse animation.
- Changing `RetroWindow` or the home page.
- Top-aligning the expanded window next to the picture (rejected: it changes the current look).
- Reclaiming the reserved space on wide screens when a window is collapsed.
