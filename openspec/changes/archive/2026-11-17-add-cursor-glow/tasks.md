# Tasks

## 1. Glow position logic

- [x] 1.1 Write failing unit tests for `getGlowTarget` in `src/shared/ui/cursor-glow/getGlowTarget.test.ts`: pointer passes through without a boundary; with a boundary the target Y is `max(pointerY, boundaryBottom + size / 2)` (superseded by 6.1); X is never clamped. Verify: `pnpm test getGlowTarget` fails for the right reason
- [x] 1.2 Implement `getGlowTarget.ts` and the pure easing step (15% approach with a sub-pixel snap; superseded by 6.2). Verify: the tests from 1.1 and an easing test (converges, stops under the threshold) pass

## 2. Hook and component

- [x] 2.1 Write failing tests for `useCursorGlow` (fake `matchMedia`, `requestAnimationFrame`, `getBoundingClientRect`): off for `pointer: coarse` / no hover and for reduced motion; reacts to a preference change without remount; `mousemove` moves the element's `transform` towards the pointer (no custom properties, no `top`/`left`); the boundary ref is read each frame; cleanup removes the listener and cancels the frame; the loop idles once settled and restarts on `mousemove`. Use `fireEvent`/manual frames, not `userEvent` with fake timers. Verify: tests fail
- [x] 2.2 Implement `useCursorGlow.ts` (`useSyncExternalStore` gating, listener, rAF loop, teardown). Verify: the tests from 2.1 pass
- [x] 2.3 Write failing `CursorGlow.test.tsx`: renders `null` when gated off; renders an `aria-hidden`, `pointer-events-none` layer when on; the glow element has no SVG filter or CSS `filter`. Verify: tests fail
- [x] 2.4 Implement `CursorGlow.tsx` (markup only, radial-gradient glow, no filter), add the `--color-glow` token to `src/app/globals.css`, export from `src/shared/ui/cursor-glow/index.ts` and `@/shared/ui`. Verify: tests from 2.3 pass, `pnpm typecheck` and `pnpm lint` clean (no `react/no-multi-comp` warnings)

## 3. Pages

- [x] 3.1 Write failing tests: `CasesPage` and `CaseDetailPage` render the glow (mock `CursorGlow`), `CaseDetailPage` passes `CASE_HEADER_ID` to `CursorGlow` as the boundary id and `CaseHeader` puts the same id on its `<header>` (the server-rendered page cannot hold a ref). Verify: tests fail
- [x] 3.2 Render `CursorGlow` in `CasesPage` and `CaseDetailPage`; give `CaseHeader` the `CASE_HEADER_ID`. Verify: tests from 3.1 and the existing cases tests pass
- [x] 3.3 Write failing `views/contacts/ui/ContactsPage.test.tsx` (title from the dictionary for `ru` and `en`, glow rendered). Verify: test fails
- [x] 3.4 Create `src/views/contacts` (`ContactsPage`, `index.ts`) and reduce `src/app/[locale]/contacts/page.tsx` to a thin route using it; the visible title text and metadata stay unchanged. Verify: 3.3 test passes, existing `pages.spec.ts` expectations for contacts still hold

## 4. E2E and visual check

- [x] 4.1 Add `e2e/cursor-glow.spec.ts` (desktop project): on `/en/cases`, `/ru/cases` and `/en/contacts` the glow moves towards a moved mouse; on a case page it stays below the header (its bounding box centre is never above the header bottom + half size) and the boundary follows after scrolling the inner container; the home page has no glow; with `reducedMotion: "reduce"` no glow is rendered; the mobile project has none. Verify: `pnpm test:e2e` passes for the new spec
- [x] 4.2 Invoke the `ui-ux-pro-max` skill, then check the three pages with the Playwright MCP on desktop and mobile viewports: glow follows smoothly, does not cover the case header, no clipped content, links and windows remain clickable, no console errors. Record a Performance trace (Chrome DevTools MCP) while moving the mouse over `/en/cases`, check there is no per-frame main-thread paint or layout from the glow and the frame time stays within budget; tune the gradient stops if the glow looks too hard or too faint. Verify: screenshots reviewed, trace shows no paint/layout from the glow, no console errors reported

## 5. Docs and final checks

- [x] 5.1 Update `CLAUDE.md` (new `CursorGlow` in `shared/ui`, `views/contacts` slice, the boundary-ref rule, the gating) and `README.md` where it describes structure. Verify: both describe the new component and slice and mention no outdated structure
- [x] 5.2 Run `pnpm check`, `pnpm fsd:check` (report `EMFILE` as an environment blocker, not a pass) and `pnpm test:e2e`; coverage thresholds are not lowered. Verify: all pass, results listed in the final answer

## 6. Smoother lag and an edge that lets the glow reach "About case"

- [x] 6.1 Write failing tests: `getGlowTarget` keeps the centre at `max(pointerY, boundaryBottom)` (no half-size offset; X untouched; no boundary passes through); `getGlowStep(current, target, dt)` covers less than half the distance in 100 ms, gives the same result for one 16.7 ms step pair as for two 8.3 ms steps, ignores an oversized `dt`, snaps within 0.5 px and converges. Verify: the new cases fail for the right reason
- [x] 6.2 Implement: `GLOW_LAG_MS = 220` replaces `GLOW_EASING`, add `GLOW_EDGE_FADE`, time-based `getGlowStep`, the new clamp in `getGlowTarget`. Verify: the tests from 6.1 pass and the old half-size cases are replaced
- [x] 6.3 Write failing hook tests (`FakeAnimationFrame` passes increasing timestamps): the same pointer jump settles on the same time at 60 and 120 Hz frame spacing; with a boundary the wrapper gets a mask whose edge equals the measured bottom, rewritten only when the bottom changes (not every frame) and removed without a boundary. Then implement it in `useCursorGlow` and `CursorGlow` (wrapper ref, mask on the fixed wrapper). Verify: hook and component tests pass, `pnpm typecheck` and `pnpm lint` clean
- [x] 6.4 Update `e2e/cursor-glow.spec.ts`: on `/en/cases/spectre` without scrolling the glow box intersects the "About case" block and not the header; after scrolling the edge and the centre follow the header; below the header the glow follows the pointer. Verify: `pnpm test:e2e` for the spec passes (use another port if 3100 is taken by a foreign server)
- [x] 6.5 Invoke `ui-ux-pro-max`, then check with the Playwright MCP at 1280x720 and 390x844: the glow trails the cursor a little and smoothly, it reaches "About case" on the first screen, no hard line at the header edge, no console errors; repeat the performance trace on `/en/contacts` (no layout and paint from the glow) and `/en/cases/spectre` (cost of the mask). Tune `GLOW_LAG_MS` and `GLOW_EDGE_FADE` if needed; switch to the hard clip only if the trace demands it. Verify: screenshots reviewed, trace numbers reported
- [x] 6.6 Fix `CLAUDE.md` and `README.md` (the boundary rule and "shows only after scrolling" are outdated; describe the edge rule, mask and time-based lag). Then run `pnpm check`, `pnpm fsd:check`, `pnpm test:coverage` and the full e2e. Verify: all green, results listed in the final answer
