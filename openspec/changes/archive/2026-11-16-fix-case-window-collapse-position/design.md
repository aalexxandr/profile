## Context

`CaseBlock` renders `<article class="flex items-center lg:flex-row">` with two children wrapped in `Reveal`: the picture and `RetroWindow`. `RetroWindow` collapses its content with a `grid-rows-[1fr] -> [0fr]` transition, so its height drops while the picture keeps the row tall. `items-center` re-centres the shorter window and the title bar slides down by half the lost height. Below `lg` the row is a column (no vertical centring), so nothing moves there. `RetroWindow` is also used on the home page and must stay untouched.

## Goals / Non-Goals

**Goals:**

- Title bar stays put on collapse/expand at `lg`+.
- Expanded layout identical to today.
- Fix lives in `views/cases`, not in `shared/ui`.

**Non-Goals:**

- Changing the window, its animation or the home page.
- Top-aligning the expanded window.

## Decisions

1. **Reserve height in a slot around the window (chosen).** New `CaseWindowSlot` (`views/cases/ui`) sits inside `Reveal` and wraps `RetroWindow`. At `lg` it has the `lg:min-h-(--case-window-height)` utility and a plain inner block that holds the window at the top, so the window stays pinned and the slot (the flex item that `items-center` centres) keeps the expanded height. Alternatives: `lg:items-start` on the article (rejected, changes the expanded look); an invisible duplicate of the expanded window in the same grid cell (rejected, duplicates DOM and needs `inert`); an `onCollapsedChange` prop on `RetroWindow` (rejected, touches the shared component).
2. **Measure with a ratcheting `ResizeObserver` (`useReservedHeight`, in `views/cases/lib`).** The hook observes the window element and stores the largest height seen at the current width, written as a CSS variable on the slot. Collapsing never changes the width, so the shrinking height is ignored. When the width changes (breakpoint change) the stored value is reset to the new height. Growth (font loading, text reflow) raises the value. Without `ResizeObserver` the slot simply reserves nothing.
3. **Reserve only at `lg`.** The variable is applied with the `lg:` variant, so on a column layout the page still shrinks. The `Reveal` wrapper only receives opacity/translate animations on its own element, so the extra inner div does not conflict with the entrance animation.
4. **Hydration.** On the server and first paint no height is stored, so the slot behaves exactly like today; the variable is set after mount. The window is expanded at that moment, so there is no layout shift.

## Risks / Trade-offs

- Empty space remains under a collapsed window on wide screens. This is the requested behaviour (the window must not move); it is bounded by the picture height anyway because the row is at least as tall as the picture.
- Reserved height is stale if the window grows while collapsed (e.g. the locale cannot change without navigation, so unlikely). The ratchet covers growth on the next observation.
- A very short expanded window next to a taller picture keeps the old look (centred); only its collapsed state is bounded by its own previous height.
- `happy-dom` has no `ResizeObserver`, so unit tests mock it.
