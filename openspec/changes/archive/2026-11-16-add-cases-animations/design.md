# Design

## Context

- `src/shared/ui/Reveal.tsx` is a server component: a `div` with one of the Tailwind `animate-reveal-{up,down,left,right,fade}` classes (700 ms, `cubic-bezier(0.22,1,0.36,1)`, fill `both`, keyframes in `src/app/globals.css`), an optional `animationDelay`, and `motion-reduce:animate-none motion-reduce:opacity-100`. `globals.css` also shortens every animation under `prefers-reduced-motion`. It has no tests. The home page imports it as `@/shared/ui/Reveal`; `@/shared/ui` already re-exports it.
- The reveal keyframes animate `translate` (except `fade`). A non-`none` `translate` makes the element a containing block for absolutely positioned descendants, and the fill `both` keeps `translate: 0 0` after the animation ends.
- `CaseBackground` is `absolute inset-x-0 top-0 -z-10` and is anchored to `body` (which is `relative`). `CLAUDE.md` forbids giving its ancestors a positioning context.
- Both cases pages scroll inside their own `overflow-y-auto` container (`CasesPage`, `CaseDetailPage`), not inside the window.
- `CaseBlock` is an `article` flex row (`lg:flex-row` / `lg:flex-row-reverse` by index parity) whose two children are `ImageWithFallback` (fixed widths, 520:430 frame) and `RetroWindow` (a client component with its own shake/jello/zoom `transform` animations on its root `section`).
- The case page sections are server components. `CaseAchievements` renders a `ul` of `li` items.

## Goals / Non-Goals

**Goals:**

- One shared entrance primitive for the home page and the cases pages, with the same keyframes and timing.
- Above-the-fold blocks stay CSS-only (no wait for hydration, no LCP delay). Only below-the-fold blocks need client JS.
- Every page section stays a server component. The client boundary is limited to the in-view wrapper.

**Non-Goals:**

- A general animation system (sequencing, exit animations, scroll-linked progress).
- Replacing CSS keyframes with JS-driven animation.

## Decisions

### 1. `Reveal` gets a `trigger` prop: `"mount"` (default) | `"visible"`

`Reveal` keeps its API (`className`, `delay`, `direction`, `children`) and gains `trigger` and `as` (`"div"` default, or `"li"`, see 5).

- `mount`: unchanged server markup. The home page does not change (spec "Home page entrance animations unchanged").
- `visible`: `Reveal` renders a client `RevealInView` with the same classes and an extra paused state (`[animation-play-state:paused]`) until the element is noticeably in view (see the hook below). Then the pause is removed for good. A paused animation also pauses its `animation-delay`, so delays count from the reveal (spec "Blocks below the first screen…"). Because fill is `both`, the paused element sits in the keyframe `from` state (hidden) during SSR and before hydration. That causes no flash and no layout shift, because only `opacity`/`translate` change.

Folder `src/shared/ui/reveal/`:

- `Reveal.tsx` — server entry that chooses the mode.
- `RevealInView.tsx` (`"use client"`).
- `useInViewOnce.ts` — client hook: `IntersectionObserver` with `root: null`, `rootMargin: "0px"` and thresholds `[0, 0.2]`. An entry counts once `isFarEnoughInView` (helper next to it) holds: `intersectionRatio >= 0.2`, or the visible part is at least 25% of the viewport height (`intersectionRect.height >= 0.25 * rootBounds.height`). The second condition covers blocks taller than the viewport, which never reach a 20% ratio on screen. The hook disconnects after the first hit. When `IntersectionObserver` is undefined it returns `true` at once.
- `revealClassNames.ts` — the direction → class map shared by both modes. (`getRevealStyle.ts` and `revealTypes.ts` sit next to it. Steiger forbids `config`/`lib`/`model` subfolders inside a `shared/ui` segment, so the folder is flat like `retro-window/`.)
- `index.ts`.

`shared/ui/index.ts` re-exports `Reveal`. Home files switch from `@/shared/ui/Reveal` to `@/shared/ui`, because the old file path disappears and case-insensitive macOS would hide a wrong-case import that fails on Linux CI.

Alternatives:

- **Make `Reveal` a client component for both modes.** Simpler, but it puts every home scene wrapper behind a client boundary for no benefit, against "keep `use client` low".
- **Add the animation class only after intersection** (and `opacity-0` before). This needs a second "hidden" style that must match each keyframe's `from` state. Pausing reuses the keyframe itself.
- **CSS scroll-driven animations (`animation-timeline: view()`).** No JS, but the animation is tied to scroll position (not play-once with delays) and has no Firefox support. Rejected.

Why not a bottom inset (`rootMargin: "0px 0px -N% 0px"`) to start later: at maximum scroll a short last block, sitting 32 px lower in its start state, can stay inside the excluded band forever. A ratio threshold has no such dead zone: a block fully in view always reaches it. This was found while implementing; the first version used `-10%`.

`root: null` works for the nested scroll containers: the viewport intersection is clipped by ancestor overflow, so no ref to the scroll container is needed.

### 2. Reveal on focus as well

`RevealInView` also reveals on `onFocusCapture`. A keyboard user tabbing into a not-yet-revealed block never focuses an invisible link, even before the scroll-into-view intersection callback runs (spec scenario "Keyboard reaches hidden blocks").

### 3. Which blocks use which trigger

Cases list (`CaseBlock` gets the trigger from `CasesPage` by index: `index === 0 ? "mount" : "visible"`). The picture is wrapped in `Reveal`, and so is the `RetroWindow`. With `isEven`, the picture uses `direction="left"` (it sits on the right on desktop and slides in from the right) and the window uses `"right"`, with delays 0 / 120 ms. Odd blocks swap the two directions. On mobile the column layout keeps the same directions (a horizontal 32 px slide inside `p-2.5`; check for horizontal overflow, see Risks).

Case page:

| Block                             | Trigger | Direction | Delay                             |
| --------------------------------- | ------- | --------- | --------------------------------- |
| Background (inner wrapper, see 4) | mount   | fade      | 0                                 |
| Back link                         | mount   | down      | 80                                |
| Category + `h1` (one wrapper)     | mount   | up        | 160                               |
| Facts                             | mount   | up        | 260                               |
| About                             | visible | up        | 0                                 |
| Stack                             | visible | up        | 0                                 |
| Achievements heading block        | visible | up        | 0                                 |
| Each achievement `li`             | visible | up        | `120 + index * 80`, capped at 600 |

Each section wrapper lives inside the section component (`CaseAbout`, `CaseStack`, `CaseAchievements`) around the existing `section`, so `CaseDetailPage` composition does not change and the `aria-labelledby` structure stays intact. Delays are literal props like on the home page. The achievement delay is computed by a small helper `lib/getStaggerDelay.ts` in `views/case-details`, with a unit test, not inline in JSX.

### 4. Never translate an ancestor of `CaseBackground`

The `header` and its parents are not wrapped. `CaseBackground` keeps its positioned root untouched and wraps only its inner layers in `<Reveal direction="fade" className="absolute inset-0">`. `fade` animates only `opacity`, so it creates no containing block, and the positioned root keeps `-z-10` against `body`. The back link, title and facts wrappers are inside the header's content `div`, which has no absolute descendants.

### 5. `as="li"` for achievements

Wrapping the content inside each `li` would leave its dashed top border static while the text slides. `Reveal` accepts `as: "div" | "li"`, so the `li` itself is the animated element, keeping `ul > li` semantics and its classes (`className` is forwarded). The allowed tags are a closed union, so classes stay static for Tailwind.

### 6. Tests

- Units (Vitest, happy-dom). `Reveal` mount mode: class per direction, `animationDelay` only when `delay > 0`, motion-reduce classes, `as="li"`. `isFarEnoughInView`: below and at 20%, at a quarter of the viewport for a tall block. `useInViewOnce`: an entry with only the edge in view keeps false, false → true once far enough in view, disconnect after the first hit, unobserve on unmount, `true` when `IntersectionObserver` is missing. `RevealInView`: paused until intersect, focus reveals. A controllable `IntersectionObserver` mock goes through `vi.stubGlobal`. Slice tests: `CaseBlock` directions per parity and trigger per index; achievements delay helper.
- E2E (`e2e/cases-animations.spec.ts`, both locales). First block / header end at computed `opacity: 1`. A lower case block on `/…/cases` has `animation-play-state: paused` before scrolling and opacity 1 after `scrollIntoViewIfNeeded`. Reduced motion (`page.emulateMedia({ reducedMotion: "reduce" })`) shows all blocks at opacity 1 without scrolling. No console errors (`consoleErrors` fixture). The home page check stays in the existing specs.

## Risks / Trade-offs

- [Below-the-fold blocks stay hidden until hydration if JS fails] → Next.js already needs JS for navigation. Only `visible` blocks are affected, and all first-screen blocks are `mount` (CSS only).
- [A late trigger keeps a block hidden while it is partly on screen] → 20% of the block or a quarter of the viewport is a short scroll. Keyboard focus reveals a block at once, and a block taller than the viewport is covered by the viewport-height condition.
- [Horizontal 32 px slide causes horizontal scroll on narrow screens] → Both page containers already clip or scroll on `y` only. Check `scrollWidth <= clientWidth` in the Playwright MCP mobile check, and if needed add `overflow-x-clip` to the list container (not `hidden`, to avoid a new scroll container).
- [Wrapper `div`s change flex sizing of `CaseBlock` children and break the 520:430 frame] → The widths sit on the children (`w-65 … lg:w-108`), so the wrappers shrink to fit. Move the width classes to the `Reveal` `className` if the MCP check shows a change. The existing frame E2E (`cases.spec.ts`) guards it.
- [`RetroWindow` shake/zoom transforms combine with the reveal translate] → They are on different elements (wrapper vs `section`), and reveal ends at `translate: 0 0`.
- [Existing E2E clicks a moving element] → Playwright waits for stable elements. If a test flakes, it scrolls first rather than adding sleeps.
- [Mobile `RetroWindow` header shake via `transform` inside a translated wrapper] → No absolute descendants rely on the wrapper. Visual check only.

## Migration Plan

Frontend only, no data or API change. Rollback = revert the change. The home page keeps `trigger="mount"` semantics by default.
