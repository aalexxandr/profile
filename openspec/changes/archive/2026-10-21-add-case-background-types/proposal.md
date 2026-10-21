## Why

The backend added a second, independent picture to a case, the background (`backgroundImage`, `backgroundBlurImage`), exposed in the case detail only. The frontend's committed contract snapshot and stub fixtures do not know these fields yet, so they would drift from the real API.

## What Changes

- Regenerate `src/shared/api/generated/schema.d.ts` from the backend (`bun run api:generate`), so `CaseDetailDto` gets `backgroundImage: string | null` and `backgroundBlurImage: string | null`; `CaseListItemDto` stays unchanged.
- Add the two fields to the stub backend fixtures (`scripts/stub-api/fixtures.ts`), with both a case that has a background and cases that do not, so the typed fixtures keep compiling.
- Add type-level assertions for the new fields to the case detail contract test, and a check that the list item does not carry them.
- Update `CLAUDE.md` where it describes nullable `image` / `blurImage`, to mention the background fields.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `backend-api-contract`: the generated types must describe the nullable background fields of the case detail and their absence from the list item.

## Impact

- `src/shared/api/generated/schema.d.ts` (generated), `scripts/stub-api/fixtures.ts`, `src/views/case-details/api/types.test.ts`, `src/views/cases/api/types.test.ts`, `scripts/stub-api/handler.test.ts`, `CLAUDE.md`.
- No runtime or UI change; no new dependencies. Requires the backend with the background change to be reachable for `api:generate`.

## Out of Scope

- Rendering the background on the case page or in the list (no UI, no dictionary keys, no Playwright checks); that needs a separate design and change.
- Admin operations (`PUT` / `DELETE /cases/:slug/background`): the client stays read-only.
- Adding `api:check` to CI.
