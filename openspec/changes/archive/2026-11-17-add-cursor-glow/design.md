# Design

## Context

Source of the effect: carbontec-site `InteractiveGradient` (a fixed layer with a 350 px blue circle blurred by an SVG `feGaussianBlur`, `--x`/`--y` custom properties written from a `requestAnimationFrame` loop that moves 15% of the distance to the pointer per frame, plus a 0.4 s CSS transition on `top`/`left`). In carbontec it is mounted once globally and has page-specific branches (home, playground) that do not apply here. See proposal.md for scope.

Constraints in this repo:

- Pages scroll inside their own `overflow-y-auto` container, not the window, so `window.scrollY` is always 0 and `scroll` events on `window` do not fire.
- `body` is `relative` with `bg-canvas`; the case header background (`CaseBackground`) is an absolute `-z-10` layer with a fading mask. A `z-index: -1` fixed glow would paint above it.
- FSD: a decorative layer used by several slices belongs to `shared/ui`; views must not import each other. The `CaseHeader` lives in `views/case-details`.
- Components stay visually clean: component file = one component; logic in hooks/helpers; every piece with logic is unit tested.

## Goals / Non-Goals

**Goals:**

- One reusable `CursorGlow` in `shared/ui` used by three pages.
- A boundary mechanism generic enough for any element, with no case-specific knowledge in `shared`.
- No work at all (no listeners, no rAF) when the glow is not rendered.

**Non-Goals:**

- A global provider or mounting in `SiteLayout`.
- Configurable colour/size props beyond what the three pages need (size is a constant; colour is a token).
- Touch/gyroscope substitutes for the pointer.

## Decisions

**1. Mount per page, not in the layout.** `CasesPage`, `CaseDetailPage` and the new `ContactsPage` render `<CursorGlow />`. Alternative: global mount filtered by `usePathname` like carbontec; rejected because it makes the layout know about routes and the locale-prefixed paths, and renders (then hides) the layer on the home page.

**2. Layering.** The layer is `fixed inset-0 overflow-hidden pointer-events-none` with `aria-hidden`, at `z-index: -1`, like the original. It is deliberately above the case header's `-z-10` background; that is why the boundary in decision 4 is needed instead of relying on stacking. Content (windows, text, images) is in normal flow and paints above it.

**3. Split by responsibility.** In `src/shared/ui/cursor-glow/`:

- `CursorGlow.tsx` — markup only (`"use client"`).
- `useGlowEnabled.ts` — the media-query gating.
- `useCursorGlow.ts` — media-query gating, listeners, rAF loop, writing the element's transform.
- `getGlowTarget.ts` — pure function `(pointer, boundaryBottom | null, glowSize) => target`, the only place with the clamp rule `y = max(pointerY, boundaryBottom + size / 2)`.
- `getGlowStep.ts` — pure time-based easing step; `constants.ts`, `mediaQueries.ts` — sizes and queries.
  Alternative: one big hook mirroring the original; rejected because the clamp and easing are the logic worth unit testing without a DOM.

**4. Boundary is measured, referenced by id.** `CursorGlow` takes an optional `boundaryId`. Each animation frame it reads `document.getElementById(boundaryId)?.getBoundingClientRect().bottom` and feeds it to `getGlowTarget`. This replaces the original `innerHeight - scrollY` arithmetic, which assumes a 100vh block and window scrolling. The bottom edge is read per frame, so it follows height changes from breakpoints, fonts and content; one `getBoundingClientRect` on one element, only while the glow moves, is cheap.
`CaseDetailPage` is a Server Component and cannot create a ref, so the contract is an id: `views/case-details/config/caseHeaderId.ts` exports `CASE_HEADER_ID`, `CaseHeader` renders it on `<header>` and `CaseDetailPage` passes it to `CursorGlow`. A test asserts both ends match. (A ref was the first idea; rejected after finding the page is server-rendered.) Alternatives: a `data-glow-boundary` attribute + `querySelector` (an implicit contract); `IntersectionObserver` on the header (gives ratios, not a continuous bottom edge).
**Edge rule (revised).** The first version kept the whole disc below the header (centre >= bottom + half the size). With a 700 px glow that put the limit below the viewport on the first screen and the glow never reached the "About case" block. The rule is now two parts: the target centre is never above the header's bottom edge (`getGlowTarget`: `max(pointerY, bottom)`), and the layer is cut at that edge with a soft fade of `GLOW_EDGE_FADE` (about 100 px) so there is no hard line. The cut is a `mask-image` on the fixed wrapper (`linear-gradient(to bottom, transparent Y, #000 Y + fade)`), written to `style` only when the measured bottom changes (scroll, resize), never on every frame. Fallback if the trace shows the mask costs too much on the case page: a hard rectangular clip (`overflow: hidden` on a wrapper whose top is the edge).
The clamp applies to the target, so the easing glides the glow to the edge instead of snapping.

**5. Easing and movement.** Easing is time-based exponential smoothing: each frame the glow covers `1 - exp(-dt / GLOW_LAG_MS)` of the remaining distance, `dt` being the difference of the `requestAnimationFrame` timestamps (capped so a stalled tab does not teleport it) and `GLOW_LAG_MS = 220`. The first version used a fixed 15% per frame, which is about 100 ms of lag at 60 Hz and twice as fast at 120 Hz; a time constant removes the refresh-rate dependence and gives the small, noticeable "trailing" behind the cursor. Drop the original `Math.round` (it freezes the circle up to 6 px short of the target) and use a snap threshold (< 0.5 px) to stop. Drop the CSS `top`/`left` transition. The loop writes the position straight to `el.style.transform = translate3d(x, y, 0)` (centred with a negative offset), not through `--x`/`--y` custom properties. Only opacity keeps a CSS transition, for the fade-in. Movement then runs on the compositor with no main-thread paint.
Alternative: fixed per-frame factor like the original; rejected as refresh-rate dependent.

**6. No runtime blur: a radial gradient instead of an SVG filter.** The glow is one element of about 700x700 px painted with a multi-stop `radial-gradient` (glow colour at the centre easing out to transparent, stops tuned to approximate a Gaussian falloff) and `border-radius: 50%`, with `will-change: transform`. It is rasterized once and then only composited. This replaces the original `feGaussianBlur` (`stdDeviation` 110 on a filter region of about 1400x1400 px), whose cost is GPU-heavy and may be paid on every frame while the glow moves. A blurred 350 px disc is visually a soft spot of roughly this size, so the look is preserved. No SVG, no filter id and no `useId` are needed. Fallback if the gradient looks too different in the visual check: CSS `filter: blur()` on a static disc, accepted only if the performance trace in the UI check stays clean.
Alternatives: SVG `feGaussianBlur` as in carbontec (fidelity, but expensive); a pre-rendered blurred PNG (cheap, but a binary asset and a fixed colour/size).

**7. Gating.** The hook subscribes to `matchMedia("(hover: hover) and (pointer: fine)")` and `matchMedia("(prefers-reduced-motion: reduce)")` through `useSyncExternalStore` (server snapshot `false`), so SSR and the first client render match (no glow) and later changes apply without a reload. When gated off the component renders `null` and the listener/rAF effect is not started.

**8. Lifecycle.** The effect adds `mousemove`, `resize` and a capture-phase `scroll` listener on `window` and starts the rAF loop; cleanup removes them and calls `cancelAnimationFrame`. Because the loop idles when settled, scroll and resize wake it: the page scrolls inside its own container (scroll does not bubble, hence capture) and the boundary may have moved without any pointer movement. The original loop never stops. The loop starts at the viewport centre and the layer fades in on the first frame, as before.

**9. Colour.** `--color-glow: #1100ff` in `globals.css` `@theme`, used as `bg-glow`. It is outside the pixel/retro accent palette on purpose (it matches the carbontec glow); a token keeps it in one place.

**10. Contacts slice.** New `views/contacts` with `ContactsPage` (title from the dictionary, as the route renders now, plus the glow) and an `index.ts` public API; `src/app/[locale]/contacts/page.tsx` stays a thin route that passes the dictionary slice. Same shape as `views/cases`.

## Risks / Trade-offs

- [A mask on the wrapper adds an offscreen surface on the case page] → written only when the edge moves, checked in the performance trace; hard clip as fallback.
- [Cost of the glow on weak devices] → no filter at all: a gradient painted once and moved by the compositor, a single element with `will-change: transform`, the loop idles when settled, nothing rendered on touch/reduced motion; confirmed with a DevTools performance trace on the three pages.
- [The gradient may not match carbontec's blurred circle exactly] → tune the stops in the visual check; fall back to a static `blur()` disc only if the trace stays clean.
- [A permanent rAF loop costs battery] → stop the loop when the glow has settled within the threshold and restart on the next `mousemove`.
- [Glow above the header background on pages without a boundary] → only the case page has a header background; the list and contacts pages have none that the glow could cover. Verified visually in the UI check.
- [Soft edge: a faint glow right under the header edge] → intended; the fade length is a constant tuned in the visual check.
- [Glow colour on top of the `RetroWindow` area is hidden by opaque windows] → expected, the glow is a background effect.
- [`CaseHeader` gets a fixed id] → one attribute; the id/boundary pairing is covered by a test.

## Open Questions

- Exact glow size and gradient stops may be tuned after seeing it on the narrow contacts layout; this does not change the specs.
