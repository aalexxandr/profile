# Proposal

## Why

`/ru/cases` (and every other page that reads cases) crashes with a full-screen `Runtime ApiError: Internal server error` when the backend answers 500. The 500 itself came from the local backend: `pnpm db:verify` in `profile-back` reported `CONTRACT.MARKER_MISMATCH` (contract storage hash `5aeaaeb…` vs database marker `15036e0…`): the local database was already migrated to a newer contract (the case background removal) than the checked-out backend code, so every query (`GET /cases`, `GET /cases/{slug}`) failed. Pulling `main` in `profile-back` (commit `09c0046`) brought the code in line with the database: `db:verify` now passes and `GET /cases?lang=ru|en` answers 200. That instance is resolved, but the frontend has no error boundary at all: any thrown error during render (backend 5xx, backend down, a bug in a component) replaces the whole site, menu included, with Next.js's default error screen. Pages should degrade to a recoverable, localized message instead.

The same gap exists for missing pages: every unknown address (`/ru/unknown-page`, `/ru/cases/unknown`) answers 404 with Next.js's default English "This page could not be found." screen, without the site menu and in neither site locale. Both cases get retro pixel-art pages that fit the site's style and cat theme (404: a pixel cat with "404" under a hanging lamp; 500: a pixel cat chewing a computer's cable).

## What Changes

- **Immediate fix (done by the user, no frontend code)**: `profile-back` was updated to `main`, so its code matches the already-migrated database; `db:verify` passes and the cases endpoints answer 200.
- Add a localized error boundary for every page under `[locale]`: an uncaught render error replaces only the page content with the 500-style error screen (illustration, title, description), while the site menu and language switcher stay usable.
- The error screen has a "Try again" button that re-renders the failed page (Next.js `retry()`) without a full reload, and a "Back to homepage" link; navigating to another page clears the error.
- The error screen never shows the raw error message or stack to visitors; the error is logged to the console for diagnosis.
- Add a localized 404 page (illustration, title, description, "Back to homepage" button) for every unknown address under `/ru` and `/en`: unknown pages, unknown case slugs, and paths the proxy redirected under a locale (e.g. `/de` → `/en/de`). It renders inside the site layout, keeps HTTP status 404 and is not indexed.
- Add the illustrations `public/404-bg.svg` (22 KB) and `public/500-bg.svg` (6 KB); all texts come from the dictionaries (`ru`, `en`).

## Capabilities

### New Capabilities

- `page-error-recovery`: how a page behaves when its render throws (backend error, network failure, component bug): the localized 500-style screen inside the site layout, retry, link home, no leaked error details, not-found left intact.
- `not-found-page`: what any unknown address under a locale shows: the localized 404 screen inside the site layout, its status, indexing and the way home.

### Modified Capabilities

- `cursor-glow`: the glow is also shown on the 404 page and on the error screen.

Otherwise none. The build-time requirements in `cases-catalog` and `case-details` ("Build requires the backend") and the API client requirement "Client reports failures explicitly" stay as they are. Unknown case slugs already answer 404 (`case-details`); only the page they show changes, which `not-found-page` specifies.

## Impact

- Code: `src/app/[locale]/layout.tsx` (wraps the page in the boundary and the error-texts provider), new `src/app/[locale]/not-found.tsx` and a catch-all `src/app/[locale]/[...rest]/page.tsx` that calls `notFound()`, a new slice for the error screens (404 page, error fallback, shared error-screen layout), `src/shared/i18n/types.ts` and both dictionaries (`errors` section), `public/404-bg.svg`, `public/500-bg.svg`.
- No new dependencies; `catchError` and `not-found.tsx` ship with Next.js 16.
- Production pages are SSG, so a backend failure during `pnpm build` still fails the build (unchanged, intended). The error boundary matters for `pnpm dev`, client-side render errors in production, and any future dynamic rendering. The 404 page is served in production for every unknown address.
- Tests: units for both screens and the wiring, a new E2E spec for the 404 page in both locales.
- Docs: `CLAUDE.md` / `README.md` gain the error and 404 pages.

## Out of scope

- Changing the backend code: the reported 500 was fixed by updating `profile-back` to `main`, and making `AllExceptionFilter` log the original error (today it logs only `"Internal server error"`, which hid the cause) is a follow-up in `profile-back`.
- Tolerating backend failures at build time (e.g. building an empty list or an "unavailable" page): it would bake a broken page into the static output until the next rebuild; the build keeps failing fast.
- `global-error.tsx` for failures in the root `[locale]` layout itself (dictionary loading, locale validation) and `global-not-found.js` for addresses outside `/ru|/en`: the proxy already moves every unlocalized path under a locale, and Next.js's built-in pages cover the rest.
- New SCSS or new `Button` styles: the screens use Tailwind with the project's tokens and the standard `Button`.
- Cursor glow, entrance animations beyond what the `ui-ux-pro-max` review asks for, error reporting services (Sentry etc.), request timeouts/retries in the API client, ISR/revalidation.
