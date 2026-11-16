# Design

## Context

See proposal.md - Why. Current state:

- `CaseBlock` renders `ImageWithFallback` with `width={520} height={430}` and `h-auto w-*` classes. `next/image` writes `width`/`height` attributes, so before load the browser reserves 520:430; after load `height: auto` follows the file's natural ratio (`spectre`: 1100x1230), which is the jump.
- The `ImageWithFallback` fallback box already uses `aspect-520/430`. `ImageWithFallback` is used only by `CaseBlock`.
- With a remote `src`, explicit `width`/`height` and `placeholder="blur"`, `next/image` draws the blur as an SVG background on the `<img>` with `viewBox='0 0 520 430'` and `preserveAspectRatio='none'` (`node_modules/next/dist/shared/lib/image-blur-svg.js`), sized `cover`. The blur therefore always fills the 520:430 box, squashed to that ratio.
- The `CaseBlock` content wrapper has a fixed `h-73 sm:h-50`; the description is `line-clamp-3 xl:line-clamp-2`. At `sm+` the fixed 200px leaves room for only about 2 description lines.
- E2E (`e2e/support/test.ts`) replaces every image request with a 1x1 PNG, so in the browser every case picture has a 1:1 natural ratio. Today that renders a square picture, which makes the jump reproducible in Playwright.
- The stub fixtures' short descriptions are all one short sentence.

## Goals / Non-Goals

**Goals:**

- Zero layout shift of a case block when its picture loads, for any picture ratio.
- Picture and "no image" box share one frame definition.
- Description clamp and card height expressed declaratively with static Tailwind classes.

**Non-Goals:**

- Matching the blur preview's crop to the final picture's crop (see Risks).
- Any change to `RetroWindow`.

## Decisions

### 1. The frame lives in `ImageWithFallback`, not in `CaseBlock`

The picture branch gets the same `aspect-520/430` as the fallback branch, plus `object-cover object-top`. The component's contract is already "the picture, or the text in the same box", and the box is currently only guaranteed for the text. `CaseBlock` keeps passing width classes (`w-65 ... lg:w-108`) and `h-auto`; CSS `aspect-ratio` without `auto` then wins over the natural ratio, so the height is computed from the width alone.

Alternative: add the aspect and object classes in `CaseBlock`. Rejected: the 520:430 ratio would then be defined in two places (fallback in shared, picture in the view) and could drift apart.

`width`/`height` props stay `520`/`430`: they still drive `srcset` sizes and the blur SVG viewBox, which already matches the frame.

UI/UX review (`ui-ux-pro-max`, task 1.1): the guidance "reserve space with `aspect-ratio` for media" (Layout / Content Jumping, high severity) matches this decision. Its Next.js entry suggests `fill` for responsive images; not adopted, because `fill` needs a positioned wrapper and a `sizes` prop, while explicit `width`/`height` plus CSS `aspect-ratio` gives the same stable box with no extra element. The 4-line clamp hides nothing essential: the full description is on the case page behind "More information". No other adjustment.

### 2. Show the whole picture with `object-contain`

Revised with the user after the first implementation: the picture must keep its own shape, not be cropped or stretched to the frame. `object-contain` scales it to fit inside the 520:430 frame and centres it (default `object-position`), leaving transparent space at the sides (portrait) or above and below (wide). The first version used `object-cover` + `object-top` (fill the frame, crop the bottom); it was dropped because it cut off part of the screenshot.

Classes, not the `style` prop: `next/image` reads `objectFit`/`objectPosition` from `style` only to pick the blur background size and position; with explicit `width`/`height` the blur SVG uses `preserveAspectRatio='none'` and fills the whole frame anyway, so passing them through `style` changes nothing visible and adds an inline style.

### 3. Card height follows the content

Remove `h-73 sm:h-50` from the `CaseBlock` content wrapper and use `line-clamp-4` on the description at every breakpoint (drop `xl:line-clamp-2`). The wrapper stays `flex flex-col items-start`; the button follows the text. `RetroWindow` already gives its content area `min-h-45`, which keeps a one-line card from collapsing, so no extra minimum is added. In the `lg` row layout the article uses `items-center`, so a window taller or shorter than the picture stays vertically centred against it.

Alternative: keep a fixed height raised to fit 4 lines (`sm:h-60`). Rejected by the user: short descriptions would leave empty space.

### 4. Tests

- Unit (`ImageWithFallback.test.tsx`): the `next/image` mock forwards `className`; assert the picture has `aspect-520/430` and `object-contain` and has neither `object-cover` nor `object-top`, and that the fallback keeps `aspect-520/430`.
- Unit (`CaseBlock.test.tsx`): the description has `line-clamp-4` and no other `line-clamp-*` / `xl:line-clamp-*` class; the content wrapper has no fixed `h-*` / `sm:h-*` height class.
- E2E (`e2e/cases.spec.ts`, both locales, desktop and mobile projects): after the picture has loaded (`img.complete` and `naturalWidth > 0`), the picture's rendered `height / width` equals `430 / 520` within 1px. With the 1x1 stub image this fails today (square) and passes after the fix, so it is a real regression test for the jump.
- E2E for the clamp: the stub fixture `orbit` gets a long short description (ru and en, long enough to exceed 4 lines at the widest card, about 400+ characters). Assert the description's rendered height is `4 x line-height` (read via `getComputedStyle`) and the "More information" link's box lies inside the window's box. Assert for `spectre` (one line) that its description height is one line.

Classes are asserted in unit tests because happy-dom does no layout; real geometry is only asserted in Playwright.

## Risks / Trade-offs

- [The blur preview fills the whole 520:430 frame, while the loaded picture is smaller with empty space around it] -> Accepted: the frame size does not change, so there is no layout shift; checked by eye in the Playwright MCP check.
- [Empty space around pictures whose ratio differs from 520:430] -> Accepted by the user; the same frame size keeps the list even, and uploading pictures closer to 520:430 is the content-side fix.
- [Cards in the list now have different heights] -> Cards are stacked one per row in a zigzag, so differing heights are not compared side by side.
- [Changing a stub fixture text could break tests that match it] -> No test matches the `orbit` short description (checked with grep); `handler.test.ts` checks structure only.
