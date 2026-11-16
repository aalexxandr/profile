## 1. Tests first (red)

- [x] 1.1 Add Vitest tests for `useReservedHeight` (mock `ResizeObserver`): keeps the largest height at one width, ignores a smaller height at the same width, resets when the width changes, reserves nothing without `ResizeObserver`
- [x] 1.2 Add a `CaseWindowSlot` test: sets the reserved height variable and renders its child, and the `lg:` classes are present
- [x] 1.3 Add a Playwright test in `e2e/cases-window.spec.ts`: at a desktop viewport the title bar `y` (and the block height) is the same before and after clicking "Свернуть окно" / "Minimize window", on `/ru/cases` and `/en/cases`
- [x] 1.4 Add a Playwright test: at a mobile viewport collapsing releases the space (the block gets shorter)
- [x] 1.5 Run the new tests and confirm they fail for the right reason

## 2. Implementation (green)

- [x] 2.1 Create `src/views/cases/lib/useReservedHeight.ts` (ratcheting `ResizeObserver`, reset on width change)
- [x] 2.2 Create `src/views/cases/ui/CaseWindowSlot.tsx` that wraps its children with the `lg:` min-height utility and the reserved-height variable on an inner block that keeps the window at the top
- [x] 2.3 Wrap `RetroWindow` in `CaseBlock.tsx` with the slot (inside `Reveal`); do not touch `RetroWindow`
- [x] 2.4 Confirm that unit and E2E tests pass (green) and refactor

## 3. Docs

- [x] 3.1 Add one sentence about the window slot to the cases notes in `CLAUDE.md` (and `README.md` if it describes the structure)

## 4. Verification

- [x] 4.1 Use the `ui-ux-pro-max` skill and check with the Playwright MCP on desktop and mobile viewports: title bar does not move on collapse/expand, expanded block unchanged, no clipped text, no console errors, `prefers-reduced-motion` works
- [x] 4.2 Run `pnpm check`
- [x] 4.3 Run `pnpm fsd:check` (report an `EMFILE` error as an environment blocker)
- [x] 4.4 Run `pnpm test:e2e`
