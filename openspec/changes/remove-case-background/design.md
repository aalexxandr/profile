# Design

## Context

See proposal.md for the motivation. The relevant current state:

- `src/shared/api/generated/schema.d.ts` is a committed snapshot written only by `pnpm api:generate` (from `$API_URL/docs-json`, default `http://localhost:3000`). Nothing regenerates it during dev, build or CI. `CaseDetail`, the stub fixtures (`scripts/stub-api/fixtures.ts`) and the static fallback (`src/shared/content/cases.ts`) are all derived from `Schemas["CaseDetailDto"]`. As long as the fields are in the schema they are **required** in fixtures and fallback data.
- The updated backend is running locally, and its `/docs-json` has no `background*` field or route (checked before this change was created).
- `CaseHeader` renders `CaseBackground` (an absolutely positioned `next/image` anchored to the page top, wrapped in a fade `Reveal`) and carries `id={CASE_HEADER_ID}`. The header spacing change already staged in git (no `min-h-85 md:min-h-100`, no `mt-auto`) belongs to this change.
- `CursorGlow` / `useCursorGlow(boundaryId?)`: only the case page passes `boundaryId`. That id drives `getBoundaryBottom` (read every frame), `getGlowTarget` (clamps the centre below the edge), `getGlowEdgeMask` + `GLOW_EDGE_FADE` + `layerRef` (mask on the layer), and a capture-phase `scroll` listener that wakes the loop because the edge moves when the page container scrolls.

## Goals / Non-Goals

**Goals:**

- After this change no file outside the generated snapshot history mentions the background fields, `CaseBackground` or the glow boundary.
- The glow code ends up smaller than before the boundary was added, not just with a dead prop.

**Non-Goals:**

- Changing glow tuning (size, lag, snap, colour) or its gating.
- Restyling the case header beyond removing the picture layer.

## Decisions

### 1. Regenerate the types first, then let `typecheck` drive the clean-up

Run `pnpm api:generate` against the running updated backend as the first step. The removed fields then become type errors in the fixtures, the fallback data, `CaseBackground`, `CaseHeader` and the tests, so `pnpm typecheck` lists exactly what to delete.
_Alternatives_: editing `schema.d.ts` by hand, or `Omit<…, "backgroundImage" | …>` in `CaseDetail`. Both are rejected: the file is generated and must match the backend, and an `Omit` would leave dead data in fixtures and fallback content.

### 2. Delete the glow boundary entirely instead of leaving it unused

`boundaryId` has no other caller, so keeping it would be speculative generality. Delete the prop, `layerRef`, `writeMask` and `lastMask`, `getBoundaryBottom`, `getGlowTarget(.test)`, `getGlowEdgeMask(.test)`, `GLOW_EDGE_FADE`, `views/case-details/config/caseHeaderId.ts` (the `config` segment goes away if it becomes empty) and the header `id`. The tick uses the pointer itself as the target.

### 3. Drop the `scroll` and `resize` listeners too

Both only woke the loop. The glow layer is `position: fixed` and the target is the pointer's `clientX/clientY`, so without a boundary neither scrolling nor resizing changes the target. Scroll mattered only because the boundary's edge moved. Resize changes nothing either: the initial centre is read once at mount. Only `mousemove` remains, which keeps the effect small and its cleanup trivial.
_Check_: the existing spec scenario "Pointer moves while the page is scrolled" still holds, since the target is in viewport coordinates. The new unit test asserts that a scroll or resize event requests no frame, and the teardown test only expects `mousemove` to be removed.

### 4. Header layout: keep the staged spacing, no reserved height

The `min-h` and `mt-auto` only made room for the picture. Without it the header is as tall as its content, and "About case" follows it with the existing `pt-6`. Entrance animations stay the same, minus the background fade: three `Reveal` blocks instead of four.

### 5. Tests replace, not just delete

Every removed behaviour that had a test gets a test for the new behaviour (TDD, red first):

- unit: no glow mask and the centre reaches a pointer at `y` near 0; `CaseDetailPage` renders `CursorGlow` without a boundary; `CaseHeader` renders no `img`; type tests assert that `CaseDetail` has no background fields; the stub handler test asserts that no detail has them.
- E2E: `cursor-glow.spec.ts` checks that the glow reaches the pointer over the case header and after scrolling, in both locales; `cases.spec.ts` checks that the case page has no case `img`; `cases-animations.spec.ts` expects three reveals in the header and drops the background-anchoring check.

## Risks / Trade-offs

- [Frontend built before the backend is deployed] → The backend must be merged and deployed first. A build against the old backend still works: openapi-fetch ignores the extra fields. So the order matters only for keeping the contract snapshot honest, not for availability.
- [The glow over header text lowers its contrast] → The glow is a soft low-alpha gradient already drawn over the case content and `/contacts`. The Playwright MCP check verifies header legibility on desktop.
- [`api:generate` picks up unrelated backend changes] → Review the `schema.d.ts` diff. Anything besides the background removal is outside this change and is reported, not silently adopted.
- [Concurrent changes `handle-missing-project-link` / `add-product-role` touch the same fixtures and header tests] → Expect simple merge conflicts and rebase onto whichever lands first.

## Migration Plan

1. Backend PR (`remove-case-background` in the backend repo) merged and deployed, migration applied.
2. Frontend: this change, built against the updated backend.
3. Rollback: revert the frontend commit. The old frontend builds against the new backend only after a regeneration, so a rollback of the backend has to come first.
