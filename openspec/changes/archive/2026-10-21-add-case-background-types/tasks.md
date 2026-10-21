## 1. Contract types

- [x] 1.1 Red: in `src/views/case-details/api/types.test.ts` assert `CaseDetail["backgroundImage"]` and `CaseDetail["backgroundBlurImage"]` are `string | null`; in `src/views/cases/api/types.test.ts` assert `CaseListItem` has no background keys; run `bun run typecheck` and confirm it fails because the fields are missing
- [x] 1.2 Green: run `bun run api:generate` against the running backend and review the `schema.d.ts` diff (only background fields and background operations expected); `bun run typecheck` now fails only in the stub fixtures

## 2. Stub backend

- [x] 2.1 Red: in `scripts/stub-api/handler.test.ts` assert detail bodies contain `backgroundImage` / `backgroundBlurImage`, one fixture case has both `null` and one has both set, and list items lack them; run and confirm it fails
- [x] 2.2 Green: add the two fields to every case in `scripts/stub-api/fixtures.ts` (first case with a background URL and blur, others `null`); tests and typecheck pass

## 3. Docs and verification

- [x] 3.1 Update `CLAUDE.md` (Backend API paragraph) to mention that `backgroundImage` / `backgroundBlurImage` exist in the case detail types but are not rendered yet
- [x] 3.2 Run `bun run check` (lint, format:check, typecheck, test, build); the build needs the backend reachable
