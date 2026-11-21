# Tasks

Prerequisite: the updated backend is running on `API_URL` (default `http://localhost:3000`) and `/docs-json` has no `background*` field. Keep it running until group 1 is done.

## 1. Contract types, stub and fallback data

- [x] 1.1 (red) Change the type tests: `src/views/case-details/api/types.test.ts` asserts `CaseDetail` has no `backgroundImage` / `backgroundBlurImage` (`not.toHaveProperty`), and `scripts/stub-api/handler.test.ts` asserts no fixture detail has either property. Verify that `pnpm test` fails on both for the right reason.
- [x] 1.2 (green) Run `pnpm api:generate`. Verify that the `schema.d.ts` diff only removes the two `CaseDetailDto` fields and the `/cases/{slug}/background` operations, and report anything else instead of adopting it. (Result: also picked up the 503/504 timeout responses from the already merged backend request-timeouts change; accepted as is, no data fields affected.)
- [x] 1.3 Remove `backgroundImage` / `backgroundBlurImage` from `scripts/stub-api/fixtures.ts` (and its comment about nullable background) and from every case in `src/shared/content/cases.ts`. Remove the fields from `src/views/case-details/api/case.test.ts` fixtures. Verify that the tests from 1.1 and `pnpm test -- scripts src/views/case-details/api src/shared/content` pass.
- [x] 1.4 Update `CLAUDE.md` / `README.md` wherever they describe the background fields in the contract (the "Backend API" paragraph). Verify that `grep -rn "backgroundImage\|backgroundBlurImage" src scripts CLAUDE.md README.md` finds nothing outside `generated/`.

## 2. Case header without a background

- [x] 2.1 (red) In `CaseHeader.test.tsx` and `CaseDetailPage.test.tsx`, replace the background cases with "the header renders no `img` and reserves no picture space" for both locales. Remove the fields from their fixtures. Verify that the new assertions fail while `CaseBackground` is still rendered. (Result: once the fields were gone from the data the new assertions already held; the failing check was `tsc` on `CaseHeader.tsx`.)
- [x] 2.2 (green) Delete `CaseBackground.tsx` and `CaseBackground.test.tsx`, and remove its use from `CaseHeader.tsx`, keeping the staged spacing change (no `min-h-*`, no `mt-auto`). Verify that the tests from 2.1 pass and that `pnpm typecheck` has no errors from `views/case-details`.
- [x] 2.3 (red → green) E2E: in `e2e/cases.spec.ts`, replace "the case page shows the background but not the case picture" with "the case page shows no case picture" (no `img` of the case, in both locales) and delete "a case without a background still shows its header" (covered by the header test). In `e2e/cases-animations.spec.ts`, change the header test to expect 3 reveals and drop the background-anchoring check. Verify these specs pass with `pnpm test:e2e -- cases`.
- [x] 2.4 Docs: in `CLAUDE.md`, remove `CaseBackground` from the `CaseHeader` folder description, the "dark `canvas` when `null`" note and the rule "Never put a translating `Reveal` around `CaseBackground`…", and change the case-page animation note to "the header back link, title and facts use `mount`, staggered 80/160/260 ms" (no background fade). Mirror this in `README.md`. Verify by grepping both files for `CaseBackground` (no hits).

## 3. Cursor glow without a boundary

- [x] 3.1 (red) In `useCursorGlow.test.tsx`, replace the `boundary` and `edge mask` blocks with: the centre reaches a pointer at `(500, 10)`; the layer never gets a `mask-image`; a scroll event (capture on a child element) and a `resize` request no frame after the glow has settled. Change the teardown test to expect only `mousemove` to be removed. Update `Probe` to the new hook signature (no argument, no `layerRef`). Verify that the scroll/resize assertions fail on the current hook.
- [x] 3.2 (green) Simplify `useCursorGlow`: no parameter, no `layerRef`, `writeMask` / `lastMask` / `getBoundaryBottom`, the target is the pointer, only the `mousemove` listener remains. Simplify `CursorGlow` (no prop, no layer ref). Delete `getGlowTarget(.test).ts`, `getGlowEdgeMask(.test).ts` and `GLOW_EDGE_FADE`. Replace the `CursorGlow.test.tsx` "accepts a boundary id" test with "the layer has no mask". Verify that `pnpm test -- cursor-glow` passes.
- [x] 3.3 (red → green) In `CaseDetailPage.test.tsx` and `CasesPage.test.tsx`, drop `data-boundary` from the `CursorGlow` mock and assert that the case page renders the glow with no props, and that the header has no `id`. Then remove `boundaryId={CASE_HEADER_ID}` from `CaseDetailPage`, the `id` from `CaseHeader` and delete `views/case-details/config/caseHeaderId.ts` (and the empty `config/` folder). Verify that the tests pass and `grep -rn CASE_HEADER_ID src e2e` finds nothing.
- [x] 3.4 (red → green) E2E `e2e/cursor-glow.spec.ts`: replace "is cut at the case header edge…", "reaches the About case block on the first screen" and "follows the mouse below the case header" with: in both `/en` and `/ru` case pages, the glow centre settles on a pointer over the case name (`h1`) and the layer has no `mask-image`; after scrolling the content by 150 px, a pointer near the top of the viewport is reached. Verify with `pnpm test:e2e -- cursor-glow`.
- [x] 3.5 Docs: in `CLAUDE.md`, remove the "Optional `boundaryId`…" bullet and the `scroll`/`resize` wake-up from the "Cursor glow" section (the rAF loop is woken by `mousemove` only), and remove the header sentence from `README.md`. Verify by grepping both files for `boundaryId`, `GLOW_EDGE_FADE` and `CASE_HEADER_ID` (no hits).

## 4. Integration checks

- [x] 4.1 Run `grep -rn -i "backgroundImage\|backgroundBlurImage\|CaseBackground\|boundaryId" src scripts e2e CLAUDE.md README.md`. Verify there are no hits. (Result: only the absence assertions in the two `types.test.ts` files and `handler.test.ts` remain, by design.)
- [x] 4.2 Invoke the `ui-ux-pro-max` skill to review the header without the picture, then run a Playwright MCP check of `/en/cases/spectre` and `/ru/cases/orbit` on desktop (1280×720) and mobile (390×844): header spacing, no clipped or overlapping text, legible header text with the glow over it (desktop), focus/hover on the back link, no console errors.
- [x] 4.3 Run `pnpm check`. Verify that it passes.
- [x] 4.4 Run `pnpm fsd:check` (a slice segment is removed). Verify that it passes, or report `EMFILE` as an environment blocker.
- [x] 4.5 Run `pnpm test:e2e`. Verify that it passes on desktop and mobile Chromium.

## Workflow follow-up

- Merge and deploy the backend change before deploying this frontend build.
- Archive the change with `/opsx:archive` after review: it syncs the deltas into `case-details`, `cursor-glow`, `cases-animations` and `backend-api-contract`.
