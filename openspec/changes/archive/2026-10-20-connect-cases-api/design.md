# Design

## Context

- The typed client already exists in `src/views/cases/api` (`getCases(locale)`, `getCase(slug, locale)`) on top of `src/shared/api` (server-only, GET-only, `API_URL`). No page uses it yet; pages read `src/views/cases/model/*`.
- `views/cases` is one slice for two pages. Both import `model/case.ts`, and `CaseBlock` and `CaseDetailPage` both use `RetroWindow`. FSD forbids one slice importing another, so a shared piece must live in a lower layer.
- Contract gaps against the current UI (from `schema.d.ts`): the list item has no `projectLink` or `objectsCount`; the detail has no `objectsCount`; `image` and `blurImage` are nullable; `role` is an enum; `company`, `teamSize`, `startedAt`, `endedAt` are new.
- `next.config.ts` allows images only from `picsum.photos`. The Next 16 docs state that `generateStaticParams` runs before pages are generated at build time and that `dynamicParams = false` makes unknown params 404.
- `bun run check` ends with `build`, and CI runs `build` and Playwright E2E, so a build that calls the backend needs a backend in all three places.

## Goals / Non-Goals

**Goals:**

- Cases pages render only backend data; mocks and their model files are gone.
- Two independent view slices, one per page, with no shared model.
- Deterministic CI and E2E without the real backend.

**Non-Goals:**

- Runtime regeneration (ISR) or a rebuild trigger on content change.
- Production backend deployment or production `API_URL` setup.
- Any change to the backend contract or to the visual style.

## Decisions

### 1. Pure SSG with failure on backend errors

`generateStaticParams` on `[locale]/cases/[slug]` loops over `locales` and maps `getCases(locale)` to `{ locale, slug }`; `dynamicParams = false` stays. The list page and the sitemap call `getCases` during the build. Errors from the client are not caught, so an unreachable backend fails the build.

- Alternative: empty list on error with `dynamicParams = true`. Rejected: it can ship an empty catalog silently.
- Alternative: ISR. Rejected by the user for now; stale content until a rebuild is a documented limitation.

A 404 from `getCase` (`ApiError` with status 404) maps to `notFound()`; any other error is rethrown.

### 2. One request per page render

`getCase` is wrapped in `React.cache` inside `views/case-details` so `generateMetadata` and the page share one request per locale and slug. The wrapper lives in the slice's `api` segment next to the request, not in the shared client.

### 3. Slice split and naming

```
src/shared/ui/retro-window/    RetroWindow, useRetroWindowAnimation, svg assets, tests
src/views/cases/               api/getCases, ui/CasesPage, ui/CaseBlock
src/views/case-details/        api/getCase, ui/CaseDetailPage, lib/createCaseMetadata
```

Each slice has its own public `index.tsx` and its own `CaseListItem` / `CaseDetail` type derived from `Schemas`. `CaseShort`, `CaseFull`, `CaseBase` and the model files are deleted. `case-details` is used instead of `case` to avoid a one-letter difference from `cases`. `RetroWindow` receives labels through props, so moving it to `shared/ui` adds no dependency on i18n. The route files in `src/app` import from both slices.

- Alternative: keep one slice with two segments. Rejected: the pages share nothing but the window chrome.
- Alternative: put `RetroWindow` in `widgets`. Rejected by the user in favour of `shared/ui`.

### 4. Content rules from the contract

- **List block:** shows name, short description and the "more information" link. The external project link is removed from the list block because `CaseListItemDto` has no `projectLink`; it stays on the case page.
- **Picture:** a small presentational piece per slice (or one in `shared/ui` if both end up identical) renders `next/image` when `image` is set, passes `blurDataURL` and `placeholder="blur"` only when `blurImage` is set, and otherwise renders the dictionary text. Both the list item and the detail carry `blurImage`, so both use the same rule.
- **Role:** new dictionary keys `pages.cases.detail.roles.FRONTEND` / `FULLSTACK` (typed as `Record<CaseDetail["role"], string>` so a new enum value fails `typecheck`).
- **Facts:** new keys for the company, team size and period labels and for "present". Dates are formatted with `Intl.DateTimeFormat` for the page locale. `null` company or team size hides its `dt`/`dd` pair.
- **"No image" text:** new key under `pages.cases` in both dictionaries.
- **`objectsCount`:** one constant mock value passed to `RetroWindow`; it is purely decorative and not tied to data.

### 5. Image host

`remotePatterns` in `next.config.ts` gets the storage host `437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz`, built through `new URL(...)` like the existing entry. The `picsum.photos` entry is removed once nothing uses it (the stub fixtures use `image: null` or the storage host pattern).

### 6. Stub backend for CI and E2E

- A Bun script (for example `scripts/stub-api.ts`) serves `GET /cases` and `GET /cases/{slug}` from fixtures typed with `Schemas["CaseListItemDto"]` / `Schemas["CaseDetailDto"]`, honours `lang`, and answers unknown slugs with 404 and the contract's error body.
- Fixtures cover both locales and the edge cases of the specs: `image: null`, `blurImage: null`, `company: null`, `teamSize: null`, `endedAt: null`, both roles.
- `playwright.config.ts` turns `webServer` into an array: the stub first, then the app, so the build inside the app command finds the stub. CI starts the stub (background) before the `build` step with `API_URL` pointing to it, and Playwright reuses it.
- Locally, `bun run check` builds against whatever `API_URL` points at; the real backend on localhost is fine, and the stub can be used when it is down. This is documented in `README.md` and `CLAUDE.md`.
- Alternative: run the real backend in CI. Not possible yet; the backend is only on localhost.

### 7. Tests

Vitest: client-facing helpers and components are tested with `getCases` / `getCase` mocked at the module boundary; `page.test.ts` for the route covers `generateStaticParams` and the 404 mapping. Playwright: both locales for list and case pages, picture fallback, ongoing-project text, unknown slug 404, sitemap entries. All of these follow the red-then-green order from `CLAUDE.md`.

## Risks / Trade-offs

- [Build depends on the backend] → CI and E2E use the stub; production build must have `API_URL` reachable (out of scope here, noted in the docs).
- [Content is stale until a rebuild] → Documented limitation; a rebuild trigger is a follow-up.
- [Stub fixtures drift from the real contract] → Fixtures are typed from the generated schema, so `api:generate` followed by `typecheck` exposes the drift; the planned `api:check` covers the snapshot itself.
- [Slugs differing between locales] → The contract treats the slug as the case identifier and `lang` only selects text, so the same slugs are expected for every locale. `generateStaticParams` still builds pairs from each locale's own list, and the sitemap takes slugs from the default locale list like today.
- [Removing the project link from the list block] → A visible change; the link remains on the case page. Revisit only if the backend adds `projectLink` to the list item.
- [Storage host in config] → The hostname is not secret, but changes of the bucket require a config change and a deploy.

## Migration Plan

1. Move `RetroWindow` to `shared/ui` with its tests (no behaviour change).
2. Split the slices and rewire the routes and sitemap to the client behind the new tests.
3. Add stub, fixtures, Playwright and CI wiring; update docs.
4. Rollback is a plain revert of the change; no data or schema migrations are involved.

## Open Questions

- The exact wording of the new dictionary strings ("no image", "present", fact labels) is decided during implementation and covered by the tests in both locales.
