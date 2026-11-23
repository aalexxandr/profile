## Why

A soft glow that smoothly follows the cursor gives the dark pages depth and a "living" feel. The cases pages and the contacts page of this site are flat dark canvases, so they get this effect.

## What Changes

- Add a decorative cursor glow: a blurred blue circle that lags smoothly behind the mouse pointer.
- Show it on `/{locale}/cases`, `/{locale}/cases/[slug]` and `/{locale}/contacts`.
- On the case detail page nothing of the glow is drawn over the case header (it is cut at the header's bottom edge with a short soft edge) but it does reach the content right below it, including the "About case" block. The header bottom is measured, because its height varies and the page scrolls inside an inner container.
- Render the glow only for a fine hovering pointer (`(hover: hover) and (pointer: fine)`) and not when the user prefers reduced motion.
- Turn the contacts route from an inline title into a `views/contacts` slice with a `ContactsPage`, like the other pages.
- The glow lags behind the pointer a little (time-based easing, about 220 ms, the same on any refresh rate).
- Improve on the original for performance: replace the runtime SVG blur with a pre-painted radial gradient moved only by `transform`, stop the animation loop when the glow has settled and cancel it on unmount, take the colour from a design token.

Out of scope: the home page, the site layout (no global mounting), the glow on touch devices, any change to the case header content or background image, new dictionary strings (the glow is decorative and `aria-hidden`).

## Capabilities

### New Capabilities

- `cursor-glow`: the decorative pointer-following glow on the cases list, case detail and contacts pages, including the case header boundary, pointer/motion gating and teardown behaviour.

### Modified Capabilities

None. Existing `cases-catalog` and `case-details` requirements describe content and animations and do not change; the glow is a separate overlay layer.

## Impact

- New `src/shared/ui/cursor-glow/` (component, hook, pure target-position helper, tests), exported from `@/shared/ui`.
- New `src/views/contacts/` (`ContactsPage`, public API); `src/app/[locale]/contacts/page.tsx` becomes a thin route file.
- `CasesPage` and `CaseDetailPage` render `CursorGlow`; `CaseHeader` carries an id that `CaseDetailPage` hands to the glow as its boundary.
- `globals.css`: a glow colour token.
- E2E additions; `CLAUDE.md` and `README.md` updated for the new shared component and the contacts slice.
- No new dependencies, no backend or API changes.
