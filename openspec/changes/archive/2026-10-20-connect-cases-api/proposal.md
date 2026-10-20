# Proposal

## Why

The typed backend client (`getCases`, `getCase`) is in place, but the cases pages still render hardcoded mocks from `views/cases/model`, so the site shows data the backend does not own. The list page and the case page are also two independent pages with different requests, types and metadata, yet they live in a single `views/cases` slice and share a model, which couples them for no reason.

## What Changes

- Replace every mocked cases request with the real backend client: the list page, the case page, `generateStaticParams`, page metadata and the sitemap all read from `getCases` / `getCase`. The mock model files and their tests are deleted.
- Generate the cases pages statically (pure SSG, no `revalidate`): `generateStaticParams` takes slugs from the backend, unknown slugs return 404, and a build fails loudly when the backend is unreachable.
- Split `views/cases` into two independent slices: `views/cases` (list) and `views/case-details` (single case). Each owns its request, types, UI and tests.
- Move `RetroWindow` and `useRetroWindowAnimation` (with their assets and tests) to `shared/ui`, since both slices use them.
- Show a localized "no image" text instead of a picture when the backend returns `image: null`, and drop the blur placeholder when `blurImage` is `null`.
- Show the backend `role` through localized dictionary labels (`FRONTEND`, `FULLSTACK`), and add `company`, `teamSize`, `startedAt` and `endedAt` to the case page (empty values are not rendered; an open `endedAt` reads as "present").
- Allow images from the S3 storage host in `next.config.ts`.
- Add a stub backend with typed fixtures so CI builds and Playwright E2E run without the real backend.
- Update `CLAUDE.md` and `README.md` to describe the new structure, SSG and the stub.

## Capabilities

### New Capabilities

- `cases-catalog`: the localized list of cases, built statically from the backend, including its picture fallback and the sitemap entries for cases.
- `case-details`: a single localized case page built statically per locale and slug, including its metadata, backend fields, localized role and picture fallback, and 404 for unknown slugs.

### Modified Capabilities

<!-- None: `backend-api-contract` already describes the client these pages now consume; its requirements do not change. -->

## Impact

- Code: `src/views/cases` (reduced to the list), new `src/views/case-details`, `src/shared/ui` (new `RetroWindow`), `src/app/[locale]/cases/**`, `src/app/sitemap.ts`, i18n dictionaries (`ru`, `en`) and their `Dictionary` type, `next.config.ts` (`remotePatterns`).
- Build: `bun run build` now requires a reachable backend at `API_URL`; CI, `playwright.config.ts` and a new stub script supply it.
- Tests: Vitest tests are rewritten for the new types and slices; E2E covers both locales, the picture fallback and 404.
- Docs: `CLAUDE.md`, `README.md`.
- Out of scope: ISR / `revalidate` and any rebuild trigger when backend content changes (for example a webhook), deploying the backend or configuring `API_URL` for production, the `api:check` CI step, admin or write operations, changes to the backend contract, and replacing the decorative `objectsCount` status text (stays a visual mock).
