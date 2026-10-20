# Proposal

## Why

The backend publishes its API as an OpenAPI 3.0 document at `GET /docs-json` and is the single source of truth for case data. The frontend currently relies on hand-written mock types (`CaseShort`, `CaseFull`) that are outdated and diverge from the real contract (for example `shortDesc` vs `shortDescription`, `image: string` vs `string | null`, `role: string` vs the `FRONTEND | FULLSTACK` enum). Generating types from the spec removes this drift and gives pages a typed way to read data.

## What Changes

- Add an `api:generate` script that reads the OpenAPI document from the backend and writes the TypeScript types for it with `openapi-typescript`, in one in-process step. The committed `schema.d.ts` is the only artifact and doubles as the contract snapshot (no separate JSON copy).
- Add a new `shared/api` segment containing the generated `schema.d.ts` and a thin, read-only (GET-only) client built on `openapi-fetch`, split by responsibility: errors and client setup. It surfaces backend errors (`ErrorResponseDto`) and a missing base URL as clear errors.
- Put the case requests with their only consumer, the `views/cases` slice, in its `api` segment: `getCases(locale)` and `getCase(slug, locale)`, with the `CaseListItem` / `CaseDetail` types. They send `?lang=` and return typed data.
- Add a server-only `API_URL` environment variable (documented in `.env.example`).
- Update `CLAUDE.md` and `README.md` with the new command, slice and variable.
- Mark the CI drift check (`api:check`) as deferred work in the docs and in the task list.

## Capabilities

### New Capabilities

- `backend-api-contract`: types generated from the backend OpenAPI snapshot and a typed read-only client for the cases API, including how the contract is refreshed.

### Modified Capabilities

<!-- None: no existing specs. -->

## Out of Scope

- Switching `/cases` and `/cases/[slug]` pages from mocks to the backend, and removing the mocks (separate change).
- Admin operations (POST, PATCH, DELETE, image upload): the site is read-only; the client does not expose them and sends no token. Their types are still generated because the whole spec is generated.
- TanStack Query or any client-side data layer; Server Components fetch directly.
- Runtime response validation (zod or similar).
- Converting date strings (`startedAt`, `endedAt`) to `Date`.
- `api:check` in CI (deferred until the backend is deployed and reachable from CI).
- Any UI change.

## Impact

- New code: `src/shared/api/` (generated types, client, errors, tests), `src/views/cases/api/` (case requests and types, tests), a generate script.
- `package.json`: new `api:generate` script; dependencies `openapi-fetch` (runtime) and `openapi-typescript` (dev).
- `.env.example`, `CLAUDE.md`, `README.md`.
- `bun run fsd:check` is relevant because a new `shared` slice is added.
