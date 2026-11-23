# Tasks

## 1. Fix the reported 500 (backend environment, done by the user)

- [x] 1.1 Bring `profile-back` code in line with the local database (pulled `main`, `09c0046`); `db:verify` reports the marker and schema match the contract
- [x] 1.2 Verify `/ru/cases` and `/en/cases` render in `pnpm dev` against the local backend (`curl 'http://localhost:3000/cases?lang=ru'` already answers 200 with 9 cases)

## 2. Spike: confirm routing and boundary placement

- [x] 2.1 Temporarily wrap `children` in `src/app/[locale]/layout.tsx` with a minimal `catchError` boundary; run `pnpm dev` and open `/ru/cases` with `API_URL=http://localhost:3999` (network failure) and against a backend answering 500 (local backend with its database stopped); verify the fallback appears inside `<main>` with the menu visible. If it does not, switch to the `error.tsx` variant (design.md, Risks) and record it in design.md
- [x] 2.2 Temporarily add a minimal `src/app/[locale]/not-found.tsx` and `src/app/[locale]/[...rest]/page.tsx` (`notFound()`); verify with `curl` on the dev server and on `pnpm build` + the standalone server that `/ru/unknown-page`, `/en/de` and `/ru/cases/unknown` answer 404 and render it inside the menu. Apply the fallbacks of design.md decision 3 if needed (`dynamicParams` on the catch-all / on `[slug]`) and record the outcome in design.md

## 3. Dictionary texts

- [x] 3.1 (red) Add a dictionary test asserting every key of `errors.notFound` (`metaTitle`, `title`, `description`, `home`) and `errors.serverError` (`title`, `description`, `retry`, `home`) is non-empty in both `ru` and `en`; verify it fails
- [x] 3.2 (green) Add the `errors` section to the `Dictionary` type and to `ru.ts` / `en.ts` with the texts from design.md decision 6; verify the test and `pnpm typecheck` pass

## 4. Shared error screen and assets

- [x] 4.1 Invoke the `ui-ux-pro-max` and `feature-sliced-design` skills; confirm the `src/views/error-pages` slice and its segments (design.md decision 4) and the visual mapping of decision 5
- [x] 4.2 Add the illustrations `public/404-bg.svg` and `public/500-bg.svg`; verify both files are served from `public/`
- [x] 4.3 (red) Unit tests for `ErrorScreen`: renders the title as a heading, the description and the actions; the illustration is decorative (`alt=""`, hidden from assistive technology) and uses the 404 or 500 file by variant; verify they fail
- [x] 4.4 (green) Implement `ErrorScreen` with the Tailwind mapping of design.md decision 5 and `useRouteLocale` (route locale with a default-locale guard) + `getNotFoundTexts` (404 texts of every locale), each with tests; verify the tests pass

## 5. 404 page

- [x] 5.1 (red) Unit tests for `NotFoundPage` with the texts of both locales for `ru` and `en`: localized title, description and `<title>`, a home link with the localized name pointing to `/ru` or `/en`; verify they fail
- [x] 5.2 (green) Implement `NotFoundPage`, `src/app/[locale]/not-found.tsx` and the catch-all `src/app/[locale]/[...rest]/page.tsx` (replacing the spike of 2.2) with the texts from `getNotFoundTexts`; verify the tests pass
- [x] 5.3 (red) E2E `e2e/not-found.spec.ts` (desktop + mobile): `/ru/unknown-page`, `/en/unknown-page`, `/ru/cases/unknown`, `/en/cases/unknown` answer 404 and show the localized title, the site menu and `noindex`; the default "This page could not be found." text is absent; the home link leads to `/ru` / `/en`; `/de` with `Accept-Language: en` ends on the English 404 page; verify it fails before 5.2 and passes after it (keep the status-only checks in `e2e/redirects.spec.ts`)

## 6. Error screen and boundary

- [x] 6.1 (red) Unit tests for `PageErrorFallback`: localized title and description, "try again" button with its accessible name calls `retry` on click and keyboard activation, home link to the localized home page, the error message (e.g. "Internal server error") is not in the DOM, `console.error` receives the error; verify they fail
- [x] 6.2 (green) Implement `PageErrorFallback` and the `catchError` boundary `PageErrorBoundary`; verify the tests pass
- [x] 6.3 (red) Layout test: `[locale]/layout` renders the boundary with `locale` and `errors.serverError` inside `SiteLayout` for each locale; a child throwing an `ApiError(500)` and a child throwing a `TypeError` (network failure) both show the error screen while the menu stays; verify they fail
- [x] 6.4 (green) Wire the boundary into `src/app/[locale]/layout.tsx` (replacing the spike of 2.1); verify the tests pass

## 7. Docs

- [x] 7.1 Describe the error pages in `CLAUDE.md` Architecture and `README.md`: the `views/error-pages` slice, `catchError` in the locale layout, `[locale]/not-found.tsx` + the catch-all, the `errors` dictionary section, the SVG illustrations, build stays fail-fast; verify both files describe the same structure

## 8. Verification

- [x] 8.1 Playwright MCP UI/UX check of the 404 page on desktop (1440×900) and mobile (390×844), `/ru/unknown-page` and `/en/unknown-page`: illustration size and position, typography and button match design.md decision 5, the illustration does not cover or clip the menu, no overlapping or clipped text, focus/hover/active states of the menu and the button, no console errors
- [x] 8.2 Playwright MCP UI/UX check of the error screen in `pnpm dev` with `API_URL=http://localhost:3999`: `/ru/cases`, `/en/cases`, `/ru/cases/<slug>` on desktop and mobile: same checks as 8.1; "try again" shows the screen again while the backend is down; start the stub (`pnpm stub:start` on that port) and verify "try again" renders the list without reload; the error appears only in the console
- [x] 8.3 Run `pnpm check`; verify it passes
- [x] 8.4 Run `pnpm fsd:check` (new `views/error-pages` slice); verify it passes or report an `EMFILE` environment blocker
- [x] 8.5 Run `pnpm test:e2e` (new routes and layout change); verify all projects pass

## 9. Cursor glow on the error pages

- [x] 9.1 (red) Unit test: `ErrorScreen` renders the cursor glow (both the 404 page and the error screen use it); E2E: add `/ru|en/unknown-page` to the mouse, touch and reduced-motion cases of `e2e/cursor-glow.spec.ts`; verify they fail
- [x] 9.2 (green) Render `CursorGlow` in `ErrorScreen` before the picture, so the glow stays under the cat on both screens (the 404 picture shares the glow's `-z-1` layer, where the earlier element is painted below); verify the tests pass
- [x] 9.3 Playwright MCP check of the 404 page and the error screen on desktop and mobile: the glow follows the mouse / sits in the centre on touch, does not cover text or the menu, no console errors; update `CLAUDE.md` and `README.md` (glow pages); run `pnpm check`, `pnpm fsd:check`, `pnpm test:e2e`

## Workflow follow-up

- Backend follow-up in `profile-back` (separate change): make `AllExceptionFilter` log the original error and stack for non-HTTP exceptions, so a 500 like this one shows its cause in the backend console.
- Archive the change after review.
