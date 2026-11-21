# Proposal

## Why

Case pages no longer have a background picture: the backend has dropped `backgroundImage` / `backgroundBlurImage` and the `/cases/:slug/background` routes. The frontend still renders `CaseBackground`, keeps the fields in its contract types, fixtures and static fallback, and holds the cursor glow out of the case header only because that header used to carry the picture. Without the picture the restriction has no reason to exist, and the glow should be free to move over the whole page.

## What Changes

- Regenerate the contract types from the updated backend (`pnpm api:generate`): `CaseDetailDto` loses `backgroundImage` and `backgroundBlurImage`. **BREAKING** for any code reading those fields (all of it is removed in this change).
- Remove the `CaseBackground` component and its tests; the case header renders its content on the plain page background (the already started header spacing change, without the min-height reserved for the picture, is part of this change).
- Remove the background fields from the stub backend fixtures, the temporary static fallback (`src/shared/content/cases.ts`) and every unit/E2E test that sets or checks them.
- Remove the glow boundary from `CursorGlow`: the `boundaryId` prop, the edge mask on the layer, the clamping of the glow centre below the header and their helpers/constants, plus `CASE_HEADER_ID` and the header `id`. The glow follows the pointer everywhere on the case page, header included, exactly as on `/cases` and `/contacts`.
- Update `CLAUDE.md` and `README.md` (background, boundary and the "translating `Reveal` around `CaseBackground`" rule).

## Out of scope

- Backend changes (already done in the backend repository; merging and deploying it is a prerequisite, not part of this change).
- The case picture in the list (`image` / `blurImage`, `ImageWithFallback`) and the S3 `remotePatterns` entry, which the list still needs.
- Any other glow behaviour: size, colour, lag, the pages it is shown on, the hover/fine-pointer and reduced-motion conditions.
- A redesign of the case header beyond dropping the picture and the space reserved for it.
- Adding `api:check` to CI.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `case-details`: the "Header shows the case background" requirement is removed.
- `cursor-glow`: the "Glow stays off the case header" requirement is removed; the glow follows the pointer over the case header like anywhere else.
- `cases-animations`: the case header no longer has a background to fade in or to keep anchored at the page top.
- `backend-api-contract`: the "Case background fields are typed" requirement is replaced by the absence of those fields in the contract and the stub.

## Impact

- Code: `src/shared/api/generated/schema.d.ts` (regenerated), `src/views/case-details` (`ui/CaseHeader/*`, `ui/CaseDetailPage.tsx`, `config/caseHeaderId.ts`, `api/types.test.ts`, `api/case.test.ts`), `src/shared/ui/cursor-glow/*`, `src/views/cases` (`api/types.test.ts`, `ui/CasesPage.test.tsx` mock), `src/shared/content/cases.ts`, `scripts/stub-api/*`.
- E2E: `e2e/cursor-glow.spec.ts`, `e2e/cases.spec.ts`, `e2e/cases-animations.spec.ts`.
- Docs: `CLAUDE.md`, `README.md`.
- Deployment order: backend first, then this frontend build. A frontend already built keeps working, since SSG data is baked in at build time.
- No new dependencies; the page loses one priority image request.
