# Tasks

## 1. Dependencies and environment

- [x] 1.1 Add `openapi-fetch` (dependency) and `openapi-typescript` (dev dependency) with pinned versions via `bun add`; verify `bun install` succeeds and `package.json` lists both
- [x] 1.2 Add `API_URL=` (server-only, no `NEXT_PUBLIC_`) to `.env.example`; verify the file lists it

## 2. Contract snapshot and generated types

- [x] 2.1 (red) Write unit tests for the generate script's fetch step: valid OpenAPI body replaces the snapshot; unreachable backend, non-200 status and non-OpenAPI body exit non-zero and leave the existing snapshot untouched; verify the tests fail for the right reason
- [x] 2.2 (green) Implement the generate script (fetch to a temp file, validate, replace the snapshot, run `openapi-typescript` from the snapshot) and add the `api:generate` script to `package.json`; verify the tests from 2.1 pass
- [x] 2.3 Read the Next.js docs relevant to the client (`node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` and `caching-without-cache-components.md`) and confirm that `API_URL` stays server-only and that `fetch` is uncached by default; verify no contradiction with design.md, otherwise update design.md
- [x] 2.4 Run `bun run api:generate` against the running backend, commit `src/shared/api/openapi.json` and `src/shared/api/generated/schema.d.ts`; verify a second run produces no diff
- [x] 2.5 Exclude generated files from ESLint (and Prettier/coverage if they cause noise) without lowering coverage thresholds; verify `bun run lint` and `bun run format:check` pass
- [x] 2.6 (red, then green) Add a type-level test that `image` and `blurImage` allow `null`, `role` is `"FRONTEND" | "FULLSTACK"`, and the error body has `status`, `message`, `timestamp`, `path`; verify it passes under `bun run typecheck` and `bun run test`

## 3. Typed read-only client

- [x] 3.1 (red) Write client tests with a mocked `fetch`, covering both locales (`ru`, `en`): `getCases` sends `GET /cases?lang=<locale>` and returns the typed list; `getCase` sends `GET /cases/<slug>?lang=<locale>` and returns the typed case; a 404 raises `ApiError` with status and message; a validation error with a message list is normalised to a string; a missing `API_URL` raises an error naming `API_URL` without sending a request; verify the tests fail for the right reason
- [x] 3.2 (green) Implement `src/shared/api/client.ts`, the `ApiError` class and `index.ts` (public API: `getCases`, `getCase`, `ApiError`, `CaseListItem` and `CaseDetail` types); verify the tests from 3.1 pass
- [x] 3.3 Add a test (or type assertion) that the public API exposes no create, update, delete or image-upload operation and that no request carries an `Authorization` header; verify it passes

## 4. Documentation and integration checks

- [x] 4.1 Update `CLAUDE.md` (commands, `shared/api` slice, `API_URL`, "regenerate with `api:generate` before using new backend fields") and `README.md` (command list and the deferred `api:check` note next to `api:generate`); verify both describe the new structure
- [x] 4.2 Run `bun run check` and `bun run fsd:check`; verify they pass (if `fsd:check` fails with `EMFILE`, report it as an environment blocker, not a pass)
- [x] 4.3 Confirm no UI, route or proxy behavior changed, so Playwright E2E and the Playwright MCP UI check are not required; state this in the final answer along with the tests added and the check results

## 5. Refactor into one coherent system

- [x] 5.1 (red) Write `scripts/generate-api.test.ts` and add `scripts/**/*.test.ts` to the Vitest `include`: `generateApiTypes` produces `string | null` for a nullable field from an inline OpenAPI object, produces identical output on a repeated run, and for an unreachable URL rejects and leaves an existing output file unchanged; verify the tests fail because the function does not exist yet
- [x] 5.2 (green) Rewrite `scripts/generate-api.ts` as `generateApiTypes(source, outFile)` on the `openapi-typescript` Node API (no snapshot, no child process) with a guarded CLI that prints a short message and exits 1 on failure; verify the tests from 5.1 pass and `bun run api:generate` against the running backend leaves `generated/schema.d.ts` unchanged
- [x] 5.3 (red) Split the client tests into `error.test.ts` (404, list of messages joined, non-JSON body), `client.test.ts` (missing or empty `API_URL` names the variable and sends no request) and `cases.test.ts` (URL, `lang` for `ru` and `en`, slug encoding, no `Authorization`); verify they fail because the modules do not exist yet
- [x] 5.4 (green) Split `client.ts` into `error.ts` (`ApiError`), `client.ts` (client from `API_URL` and `unwrap`) and `cases.ts` (`getCases`, `getCase`), and update `index.ts`; verify the tests from 5.3 pass and `bun run typecheck` is clean
- [x] 5.5 Delete `src/shared/api/openapi.json`, `fetch-openapi-document.ts`, `refresh-openapi-snapshot.ts` and their tests, and remove `openapi.json` from `.prettierignore`; verify `grep -rn "spawnSync\|openapi.json\|refresh-openapi\|fetch-openapi" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=openspec` finds nothing
- [x] 5.6 Update `CLAUDE.md` and `README.md` (no snapshot, `api:generate` writes `generated/schema.d.ts` directly, `api:check` TODO now "regenerate and diff `schema.d.ts`"); verify neither mentions `openapi.json`
- [x] 5.7 Prove the tests bite (drop `lang` in `cases.ts`; make `generateApiTypes` write before generating), restore, then run `bun run check`, `bun run test:coverage` and `bun run fsd:check`; verify all pass and coverage thresholds hold

## 6. Move case requests next to their consumer (FSD)

- [x] 6.1 (red) Move the case tests to `src/views/cases/api/cases.test.ts` (import `./cases`, both locales) and split `types.test.ts` (case type assertions to `src/views/cases/api/types.test.ts`, the error body assertions stay in `shared/api`); update the `shared/api` tests: `index.test.ts` expects exactly `ApiError`, `createApiClient` and `unwrap`, `client.test.ts` asserts the client type exposes only `GET`; verify the tests fail because the new modules and the GET-only type do not exist yet
- [x] 6.2 (green) Move `getCases` / `getCase` to `src/views/cases/api/cases.ts` and `CaseListItem` / `CaseDetail` to `src/views/cases/api/types.ts` (aliases of the new `Schemas` export), make `createApiClient` GET-only, update `shared/api/index.ts`, and delete `shared/api/cases.ts`; verify the moved and updated tests pass and `bun run typecheck` is clean
- [x] 6.3 Update `CLAUDE.md` and `README.md` (where the requests live and what `shared/api` exports); verify neither describes `getCases` / `getCase` as part of `shared/api`
- [x] 6.4 Run `bun run check`, `bun run test:coverage` and `bun run fsd:check`; verify they pass, that `views/cases/api` imports the client only through `@/shared/api`, and that coverage thresholds hold

## Workflow follow-up

- Deferred (not part of this change, blocked until the backend is deployed and reachable from CI): add `api:check`, which regenerates the types in a temporary location and fails if they differ from the committed snapshot, and wire it into `.github/workflows/ci.yml`. This must stay visible in `README.md` next to `api:generate`.
- Follow-up change: switch `/cases` and `/cases/[slug]` from mocks to the client, remove the outdated mock types and data, convert date strings, handle `null` pictures, and choose a `revalidate` strategy per route.
- Archive the change after the project's review requirements are satisfied.
