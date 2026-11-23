# Design

## Context

- Root cause of the reported error was outside this repo: the local `profile-back` code was behind its already-migrated database (`db:verify` → `CONTRACT.MARKER_MISMATCH`), so the backend answered 500 to every case query; pulling `main` there fixed it. `AllExceptionFilter` logs only `"Internal server error"`, which is why the backend console did not show the cause. See proposal.md - Why.
- Frontend data path: `getCases` / `getCase` → `unwrap` → `throw ApiError.from(...)`. The throw is correct per the `backend-api-contract` spec; nothing catches it during render because there is no `error.tsx`, `not-found.tsx` or other boundary anywhere in `src/app`.
- `src/app/[locale]/layout.tsx` is the root layout (no `src/app/layout.tsx`); it loads the dictionary and renders `SiteLayout`, which puts the page in `<main className="grid min-h-0">{children}</main>`. `body` is `relative`, so a decorative layer can be anchored to the top of the page behind the menu (documented pattern).
- Both `[locale]/layout.tsx` and `cases/[slug]/page.tsx` set `dynamicParams = false`. Observed on the dev server today: `/ru/unknown-page`, `/ru/cases/unknown` and `/en/cases/unknown` all answer 404 with Next's default page, no site menu.
- Next.js 16 docs (`node_modules/next/dist/docs/`): `catchError` from `next/error` wraps any subtree, receives regular props plus `{ error, retry }`, lets `notFound()`/`redirect()` pass through and clears on client navigation. `not-found.js` takes **no props**, renders in its segment inside the layouts above it, answers 404 before streaming and injects `noindex`. The docs name "root layout under a top-level dynamic segment" (our `[locale]`) as the case where a consistent 404 is hard; `global-not-found.js` is experimental and bypasses the layout, so it would lose the menu and the locale.
- Shared UI: `shared/ui/Button` is the retro button (`#cecece` face, inset shadows, accent `#db00ff` hover, `font-vcr` 12 px uppercase); the screens use it as is.

## Goals / Non-Goals

**Goals:**

- One error boundary for every page under `[locale]` and one 404 page for every unknown address under `[locale]`, both inside the site layout.
- Two retro pixel-art screens built with Tailwind on this project's tokens and components.
- Localized texts through the server dictionaries, with no dictionary shipped to the client bundle.

**Non-Goals:**

- Distinguishing error kinds in the UI (5xx vs network vs bug): one generic screen.
- Any change to `shared/api` or the request functions: they keep throwing.

## Decisions

1. **Error boundary: `catchError` wrapper in the locale layout instead of `error.tsx`.** The layout renders `<PageErrorBoundary locale={locale} texts={dictionary.errors.serverError}>{children}</PageErrorBoundary>` inside `SiteLayout` (`catchError` passes these props to the fallback). `error.tsx` gets no props and would need the dictionaries on the client. Rejected.

2. **No shared context.** The error fallback gets its texts as `catchError` props from the layout. `not-found.tsx` takes no props, so it loads the 404 texts of both locales on the server (`api/getNotFoundTexts`) and the client `NotFoundPage` picks its own with `useParams().locale` (`lib/useRouteLocale`, default locale as a guard; verified for the catch-all, unknown slugs and `/de` → `/en/de` by `e2e/not-found.spec.ts`). Next embeds the rendered `not-found` in every page of the segment, so both locales' 404 strings (~450 bytes) ride along on every page; an earlier client context (`ErrorPagesProvider`) cost about the same bytes and more code, so it was removed.
   - Alternatives: `headers()` in `not-found.tsx` (makes every 404 dynamic, needs the proxy to pass the locale); importing the dictionaries in the client (3–4.5 KB per locale); `global-not-found.js` (no layout, no menu, experimental). Rejected.

3. **Unknown pages are routed to `notFound()` by a catch-all.** `src/app/[locale]/[...rest]/page.tsx` calls `notFound()`, so an address that matches no page renders `[locale]/not-found.tsx` inside the layout with status 404. It has no `generateStaticParams` and opts into `dynamicParams = true` if the layout's `false` would otherwise reject it before rendering (confirmed in the spike, task 2). Unknown case slugs keep `dynamicParams = false`; the spike checks that they reach `[locale]/not-found.tsx`. If they do not, `[slug]` switches to `dynamicParams = true` and relies on the existing `getCaseOrNotFound` (backend 404 → `notFound()`; the static fallback already raises `ApiError(404)`), which keeps the observable 404 of the `case-details` spec. Record the outcome here.
   - **Spike outcome (2026-11-23):** no fallback needed. In `pnpm dev` and on the standalone production server, a catch-all `[locale]/[...rest]/page.tsx` calling `notFound()` (no `generateStaticParams`, no `dynamicParams` override; the build marks it `ƒ`) renders `[locale]/not-found.tsx` inside the layout with status 404 and `noindex` for `/ru/unknown-page`, `/en/de` (after the proxy redirect) and `/ru/cases/a/b`; unknown slugs under `[slug]` with `dynamicParams = false` (`/ru/cases/unknown`, `/en/cases/unknown`) reach the same `not-found.tsx`. A `catchError` wrapper around `children` in the locale layout catches an `ApiError(500)` thrown by a page Server Component during SSR and shows its fallback inside `<main>` with the menu; a prerender error still fails `pnpm build`. The document title of the 404 is empty, so decision 7 is needed.

4. **One slice for both screens.** The screens are pages, so they live in `src/views/error-pages` (confirm with the `feature-sliced-design` skill): `ui/ErrorScreen` (the shared layout: illustration, title, description, actions slot, `variant: "notFound" | "serverError"`), `ui/NotFoundPage`, `ui/PageErrorFallback`, `ui/PageErrorBoundary` (`catchError`), `api/getNotFoundTexts`, `lib/useRouteLocale`, `lib/useReportError`, `config/` for the illustration paths and sizes. The route files stay thin: `not-found.tsx` renders `NotFoundPage` with the loaded texts, the catch-all calls `notFound()`, the layout wraps the page in the boundary.

5. **Layout.** Tailwind utilities with the values below; the vertical offsets are tuned in the Playwright check so nothing overlaps the menu:
   - Breakpoints: 480 px, 640 px (= Tailwind `sm`), 1204 px. Use `sm` for 640 and arbitrary `min-[30rem]:` / `min-[75.25rem]:` variants for the other two (no new theme tokens for a single page).
   - 404: illustration `absolute`, behind the menu (`-z-1`, anchored to the `relative` body like other decorative layers), `top` −60 px (−70 px ≥1204), width 546 → 583 (≥480) → 686 px (≥640), horizontally centred; text block `margin-top` 384 → 441 → 464 → 466 px, everything centred, content width 500 px from 640.
   - 500: illustration in the flow, `margin-top` 100 → 94 → 160 → 168 px, width 100 % → 412 → 424 px; text `margin-top` 50 → 80 → 85 px, left-aligned below 640 and centred from 640, content full width → 500 px.
   - Title: Helvetica 700, uppercase, `letter-spacing` 1 px, 20/26 px → 24/32 (≥640) → 30/36 (≥1204). Description: 16/22 → 18/24 (≥640). Gaps: 10 px inside the text block, 20 px between text and actions. White on `bg-canvas`.
   - Actions: the standard `Button` (no new variant or size), full content width. 404: one link "Back to homepage" → localized home (`getLocalizedPath("home", locale)`). 500: "Try again" (`retry()`) and the same home link under it.
   - Illustrations: `public/404-bg.svg` and `public/500-bg.svg`, rendered with `next/image` (`alt=""`, `priority`, intrinsic `width`/`height` from `config/illustrations`), like the neighbouring `ContactsInfo` does with `bg-contacts-page.svg`; Next serves SVG unoptimized. Decorative: the title carries the meaning. The 404 picture sits in an `absolute inset-x-0 top-0 -z-1 overflow-x-clip` layer so its 546–686 px width never scrolls the page sideways on phones, and its top fades out above the lamp so the cord does not cross the centred menu. Not `?svgr`: inlining 22 KB into JS would grow the bundle.

   - Cursor glow: `ErrorScreen` renders the shared `CursorGlow` on both screens, before the picture in the DOM, so the glow stays under the cat: the 404 picture shares the glow's `-z-1` layer (the earlier element is painted below), the 500 picture is in the flow and above it anyway.

6. **Texts.** Dictionary section `errors: { notFound: { metaTitle, title, description, home }, serverError: { title, description, retry, home } }` in the `Dictionary` type and both locales (the existing `errors` key inside `pages.contacts` is unrelated). English: "Nothing is here" / "Some things just don't exist... Try to return to homepage." / "Back to homepage"; "Something went wrong" / "Try again in a moment or go back to the homepage." / "Try again" (no "we are already fixing it": the boundary also catches client bugs and nobody is paged). Russian: "Здесь ничего нет" / "Некоторых страниц просто не существует… Попробуйте вернуться на главную." / "На главную"; "Что-то пошло не так" / "Попробуйте ещё раз чуть позже или вернитесь на главную." / "Попробовать снова". Title case comes from CSS `uppercase`, not from the strings.

7. **404 title.** `not-found.tsx` is a segment file, where `metadata` exports are not documented, so the 404 view renders a React 19 `<title>` from `errors.notFound.metaTitle`; Next adds `noindex` itself.

8. **Logging.** The error fallback logs `error` with `console.error` in an effect, as in the Next docs; the UI renders dictionary texts only.

9. **Build stays fail-fast.** `generateStaticParams`, `sitemap.ts` and the SSG pages keep letting `ApiError` escape at build time.

## Risks / Trade-offs

- [`catchError` in a layout might not catch an error thrown by the page Server Component during SSR the way `error.tsx` does] → Spike first (task 2). If it does not, use `src/app/[locale]/error.tsx` rendering `PageErrorFallback`, with its texts loaded like the 404's; record the switch here.
- [The catch-all or `dynamicParams = false` might bypass `[locale]/not-found.tsx`] → Spike (task 2) with the fallbacks in decision 3.
- [Absolute offsets of the 404 picture depend on the menu height] → They are starting values; the Playwright MCP check on desktop and mobile tunes them so nothing overlaps the menu or clips.
- [Next.js 16.4 bug: a client RSC request for an unknown case slug (the language switcher's prefetch on `/en/cases/unknown`) loops on `_rsc` 307 redirects, because `[slug]` (`dynamicParams = false`) strips the router headers before the catch-all serves the 404] → Accepted until upstream PR vercel/next.js#101912 ships: the router falls back to a full page load, so the visitor lands on the right 404; the cost is console errors and a few dozen tiny 307s on that page only, no effect on SEO (crawlers get the HTML 404) or on other pages. Rejected workarounds: `dynamicParams = true` (Next answers the RSC request with an invariant 500), `experimental.validateRSCRequestHeaders: false` (works, but drops the CDN cache-poisoning check site-wide). Re-check after upgrading Next.
- [In `pnpm dev` the Next error overlay still pops up for caught errors] → Expected; the page underneath shows the error screen. Production shows only the screen.
- [The backend-failure path cannot be reproduced by E2E: E2E runs the SSG build against the stub, where a backend 500 fails the build instead of reaching a page] → Unit tests cover the error screen and wiring; the path is checked by hand in `pnpm dev` with the Playwright MCP. The 404 page is fully covered by E2E.
- [Retry while the backend is still down shows the error screen again] → Accepted: the button stays and nothing spins.

## Migration Plan

1. Done: `profile-back` pulled to `main`, `db:verify` ok, `GET /cases?lang=ru` answers 200. This alone fixed the reported page.
2. Ship the boundary and the 404 page. Rollback: remove the provider and boundary from the layout, delete `not-found.tsx` and the catch-all; no data or URL changes.
