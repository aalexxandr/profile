# Design

## Context

See proposal.md for motivation. The backend serves an OpenAPI 3.0.0 document at `GET /docs-json` (no auth). A probe run of `openapi-typescript` 7.13 against it produced `string | null` for nullable fields, a `"FRONTEND" | "FULLSTACK"` union for `role`, and resolved every `$ref`. The document describes the whole API, including admin operations with a bearer scheme; this site only reads. The app is Next.js 16 without `cacheComponents`, so `fetch` is uncached unless configured (see `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`). `shared` currently holds `i18n`, `i18n-server` and `ui`; the snapshot tooling must live outside `src` build output concerns (FSD lint, ESLint, Prettier).

## Goals / Non-Goals

**Goals:**

- One command refreshes the contract; the result is reviewable in a PR diff.
- Pages can call a typed function and get typed data or a clear error.
- No new runtime concerns on the client bundle.

**Non-Goals:**

- Choosing page-level caching strategy per route (done when pages are switched).
- Runtime validation of responses.
- A generic wrapper for every endpoint.

## Decisions

**One-step generation with the `openapi-typescript` Node API.** `scripts/generate-api.ts` exports `generateApiTypes(source, outFile)`: `astToString(await openapiTS(url))`, then a single file write. There is no intermediate JSON copy and no child process. The committed `src/shared/api/generated/schema.d.ts` is itself the snapshot of the contract: it keeps every description and example, and its PR diff shows what changed in the backend. The file is written only after generation succeeds, so an unreachable backend or an invalid document cannot damage it; the CLI wrapper turns the failure into a short message and exit code 1. The CLI runs only when the file is the entry point, so tests import the function. Alternatives: a committed `openapi.json` plus a generator subprocess (two artifacts and glue modules for no gain, replaced by this); a bare `openapi-typescript <url> -o <file>` package script (no code, but a raw stack trace on failure and nothing to reuse for the later `api:check`); orval / hey-api (bring their own clients and optionally zod, more than a read-only site needs).

**Shared infrastructure, local requests.** `shared/api` holds only what every consumer needs. `error.ts` defines `ApiError` (status and a message normalised from `ErrorResponseDto`, a string or a list). `client.ts` builds the `openapi-fetch` client lazily from `process.env.API_URL` (a missing variable throws before any request, naming it), typed as GET-only so write operations cannot be called, and exposes `unwrap(result)`, which returns the data or throws `ApiError`. `index.ts` exports `ApiError`, `createApiClient`, `unwrap` and a `Schemas` type (the generated component schemas). The case requests are not shared: the list is used only by the cases page and the detail only by the case page, both in the single `views/cases` slice, so per the FSD request placement rule `src/views/cases/api/cases.ts` holds `getCases(locale)` and `getCase(slug, locale)`, each a single `unwrap` call, and `api/types.ts` holds `CaseListItem` / `CaseDetail` as aliases of `Schemas`. They stay internal to the slice (not in its public API). If another slice ever needs them, they move to `shared/api` at that point. Alternatives: all request functions in `shared/api` (the previous iteration; couples shared to one page's data and widens the surface); one `client.ts` holding everything (the first iteration, hard to read and to test in parts).

**Server-only variable.** `API_URL` has no `NEXT_PUBLIC_` prefix (per Next.js environment variable docs it is then not bundled for the browser). The client module imports nothing browser-specific and is only used from Server Components. No TanStack Query: the site is read-only, so Server Components fetch directly.

**Caching is left to the caller.** The client passes through Next's `fetch` options where the page needs them; this change sets no defaults beyond Next's own (uncached). Choosing `revalidate` per route belongs to the change that switches the pages.

**Placement.** `src/shared/api/` is itself a segment of `shared`, so it holds its files flat (no nested `lib/` or `model/`, which Steiger rejects). Request functions and case types live in the `api` segment of `views/cases`, which imports the infrastructure only through `@/shared/api`. The generator lives in `scripts/` because it is tooling, not application code; `vitest.config.mts` also runs `scripts/**/*.test.ts` (coverage still measures `src` only). The generated file is excluded from ESLint and, if needed, Prettier and coverage so generated code does not cause lint noise or lower coverage thresholds (thresholds are never lowered).

## Risks / Trade-offs

- [Types only reflect the deployed backend, not its branch] → Refresh with `api:generate` before starting work that depends on new fields; the commit shows when.
- [Types file drifts from the backend unnoticed] → Deferred `api:check` (see below); until then refresh manually.
- [Generated types are not runtime guarantees] → Accepted; no response validation in this change.
- [Spec is OpenAPI 3.0, generators may change nullable handling] → `openapi-typescript` version is pinned; a typecheck test on the nullable fields guards it.
- [Generated admin types invite accidental use] → Not exported from the slice's public API.

## Migration Plan

Additive. Nothing consumes the slice yet; rollback is removing the slice, scripts and dependencies. Pages keep using mocks until the follow-up change.

## Deferred Work

`api:check`: regenerate in a temp location (reusing `generateApiTypes`) and fail if it differs from the committed `schema.d.ts`, wired into CI. Blocked until the backend is deployed and reachable from CI. It is recorded as a plain bullet under "Workflow follow-up" in tasks.md (not a tracked checkbox, so it does not block completion of this change), and noted in `README.md` next to `api:generate`.
