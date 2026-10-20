# Tasks

## 1. Move RetroWindow to shared/ui

- [x] 1.1 Move `RetroWindow`, `useRetroWindowAnimation`, their SVG assets and tests to `src/shared/ui/retro-window/`, export it from `@/shared/ui`, and update imports; verify the moved tests pass unchanged and `bun run typecheck` is green
- [x] 1.2 Verify `src/views/cases` no longer contains `RetroWindow` files and `bun run fsd:check` reports no new violations

## 2. Dictionaries and config

- [x] 2.1 (red) Add tests in both locales for the new keys: role labels for `FRONTEND` / `FULLSTACK`, "no image", "present", company, team size and period labels; verify they fail
- [x] 2.2 (green) Add the keys to the `Dictionary` type and to `ru` and `en` (role labels typed from the generated `role` enum); verify the tests and `bun run typecheck` pass
- [x] 2.3 (red) Add a test that `next.config.ts` allows the storage host `437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz`; verify it fails
- [x] 2.4 (green) Add the host to `remotePatterns`; verify the test passes and a build serves an image from that host

## 3. Stub backend and fixtures

- [x] 3.1 (red) Write a Vitest test for the stub handler: `GET /cases?lang=ru|en` returns the typed list, `GET /cases/{slug}` returns the detail, an unknown slug returns 404 with the contract error body; verify it fails
- [x] 3.2 (green) Add typed fixtures (both locales; cases covering `image: null`, `blurImage: null`, `company: null`, `teamSize: null`, `endedAt: null`, both roles) and the Bun stub script with a `stub:start` command; verify the test passes and `bun run typecheck` rejects a fixture that breaks the contract
- [x] 3.3 Make `playwright.config.ts` start the stub before the app build/start (`webServer` array) and start the stub in `.github/workflows/ci.yml` before the `build` step with `API_URL`; verify `bun run test:e2e` builds and runs against the stub without the real backend

## 4. Case details slice (`views/case-details`)

- [x] 4.1 (red) Write tests for `getCase` (wrapped in `React.cache`, one request for repeated calls with the same arguments), `createCaseMetadata` (title, description, canonical, alternates for both locales and `x-default`) and `CaseDetailPage` (backend fields, localized role, optional company / team size hidden when `null`, period with "present", "no image" text and no blur placeholder cases, both locales); verify they fail
- [x] 4.2 (green) Create `src/views/case-details` with `api`, `lib/createCaseMetadata` and `ui/CaseDetailPage` using `CaseDetail` from `Schemas`; verify the tests from 4.1 pass
- [x] 4.3 (red) Rewrite `src/app/[locale]/cases/[slug]/page.test.ts` for `generateStaticParams` built from `getCases` per locale, `notFound()` on a 404 `ApiError` and rethrow of other errors; verify it fails
- [x] 4.4 (green) Switch the route to `getCase` / `getCases` with `dynamicParams = false`; verify the test passes and `bun run build` against the stub generates `/ru/cases/<slug>` and `/en/cases/<slug>` for every fixture
- [x] 4.5 Delete the case-related mocks and tests from `views/cases/model` that belong to the case page; verify no references remain (`rg "getMockCase"` is empty)

## 5. Cases list slice (`views/cases`)

- [x] 5.1 (red) Write tests for `CasesPage` and `CaseBlock` with `CaseListItem` data: one block per case, link to `/<locale>/cases/<slug>`, no external project link, "no image" text and no `img` for `image: null`, empty list renders only the title, both locales; verify they fail
- [x] 5.2 (green) Update `CasesPage` / `CaseBlock` to `CaseListItem`, remove the external link from the block, add the picture fallback and keep `objectsCount` as a single constant mock; verify the tests pass
- [x] 5.3 (red) Add a test for the list route (`/cases` page) loading `getCases(locale)` and failing on a client error; verify it fails
- [x] 5.4 (green) Switch `src/app/[locale]/cases/page.tsx` to `getCases`; verify the test passes
- [x] 5.5 (red) Update `src/app/sitemap.test.ts` so case entries come from a mocked `getCases(defaultLocale)` for every locale with alternates and `x-default`; verify it fails
- [x] 5.6 (green) Switch `src/app/sitemap.ts` to `getCases` (making `sitemap` async); verify the test passes
- [x] 5.7 Delete `src/views/cases/model/*` and its tests and update `src/views/cases/index.tsx`; verify `bun run typecheck` and `rg "model/case"` are clean

## 6. End-to-end and UI checks

- [x] 6.1 Update Playwright specs (`cases-window.spec.ts`, `pages.spec.ts`, `navigation.spec.ts`, `links.spec.ts`) to the fixture data and add scenarios for both locales: list, case page, "no image" fallback, "present" period, unknown slug 404, sitemap case entries; verify `bun run test:e2e` is green on desktop and mobile
- [x] 6.2 Invoke the `ui-ux-pro-max` skill for the new facts block and picture fallback, then check `/ru/cases`, `/en/cases` and a case page with the Playwright MCP on desktop and mobile viewports (no clipped or overlapping text, focus / hover / active states, no console errors)

## 7. Documentation and final checks

- [x] 7.1 Update `CLAUDE.md` (slice structure, SSG and build-time backend dependency, stub, commands, `RetroWindow` in `shared/ui`) and `README.md`; verify no text still mentions mocks in `views/cases/model` or the single `views/cases` slice
- [x] 7.2 Run `bun run check` (against the stub) and verify it passes
- [x] 7.3 Run `bun run fsd:check` and verify it passes (an `EMFILE` watch error is reported as an environment blocker, not a pass)
- [x] 7.4 Run `bun run test:e2e` and verify it passes on desktop and mobile
