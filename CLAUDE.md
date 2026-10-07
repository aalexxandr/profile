# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is `bun`. Tests: Vitest + React Testing Library (happy-dom), colocated as `src/**/*.test.ts(x)`; `bun run test` (one run) / `bun run test:watch`. Coverage rollout plan is in `TESTING_PLAN.md`. `?svgr` imports are stubbed in `vitest.config.mts`.

- `bun run dev` — dev server; `bun run build` / `bun run start` — production build / serve
- `bun run lint` (`lint:fix` to autofix), `bun run format:check` (`format` to write), `bun run typecheck` (`next typegen` + `tsc --noEmit`; typegen creates the gitignored `next-env.d.ts` that CI lacks)
- `bun run check` — lint + format:check + typecheck + test + build (run before finishing a change)
- `bun run fsd:check` — Steiger FSD lint. It may fail with `EMFILE: too many open files, watch`; report that as an environment blocker, not a pass.

## Automation

- `.claude/settings.json` hooks: after every Edit/Write the file is formatted (Prettier) and fixed (ESLint) by `.claude/hooks/format-file.ts`; remaining ESLint errors are returned to you, fix them. On Stop, `typecheck` must pass (`.claude/hooks/typecheck-on-stop.ts`).
- Pre-commit (husky + lint-staged) runs ESLint/Prettier on staged files. CI (`.github/workflows/ci.yml`) runs lint, format:check, typecheck, test, build and fsd:check.
- Reading `.env*` is denied in `.claude/settings.json`; `.env.example` lists the variables.

## Next.js version warning

This is Next.js 16 (React 19, Tailwind 4) with breaking changes vs. older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code. For example, the middleware file is `src/proxy.ts` exporting `proxy` (not `middleware`).

## Architecture

- FSD-like layout in `src/`: `app` → `views` → `widgets` → `shared`. (Next's `app/` is the FSD app layer; pages live in `views/` and are composed by thin route files in `src/app`.) Use the `feature-sliced-design` skill for any placement/import/public-API decision.
- Imports use the `@/` alias (e.g. `@/shared/i18n`); deep `../../` imports are an ESLint error.
- **i18n routing**: all routes live under `src/app/[locale]/` (locales `ru`, `en`; config in `src/shared/i18n`): `/`, `/cases`, `/contacts`. `src/proxy.ts` redirects unlocalized paths using the `Accept-Language` header. Server-only dictionary loading, metadata helpers and locale validation are in `src/shared/i18n-server` (dictionaries in `dictionaries/ru.ts` and `en.ts`).
- Every user-facing string, alt text, nav label and metadata goes through the dictionaries: add keys to the `Dictionary` type and to **both** `ru` and `en` (both are `satisfies Dictionary`, so `typecheck` catches mismatches).
- `src/app/_layout/SiteLayout.tsx` holds site-wide layout composition.
- SVGs imported with the `?svgr` query are converted to React components via `@svgr/webpack` (Turbopack rule in `next.config.ts`). Remote images are only allowed from `picsum.photos`.

## Keeping docs current

When a change alters the project architecture (layers/slices, `src` structure, routing, i18n, key dependencies, MCP servers, commands, hooks/CI), update `CLAUDE.md` and `README.md` in the same change so they never describe outdated structure.

## Code conventions

- Server Components by default; add `"use client"` only for hooks, browser APIs, events, animations, or client-only libs, and keep it as low in the tree as possible.
- Strict TypeScript, no `any` (ESLint error); use `import type` for type-only imports. Keep JSX declarative: split large UI blocks into focused components, move non-trivial logic into hooks (`useSomething`) or helpers, and don't mix UI, data fetching and state machines in one component. Follow neighbouring patterns before introducing new abstractions.
- Tailwind: use `clsx` for conditional classes; never build class names from dynamic strings (breaks Tailwind/Prettier analysis). Keep the existing pixel/retro visual style.
- Accessibility: interactive elements need an accessible name; images get meaningful `alt` from the dictionary, decorative ones are explicitly decorative.
- Page metadata is created through the existing i18n helpers.

## Verification

- Before finishing: `bun run check`, plus `bun run fsd:check` for architectural changes. If a check cannot run, say why. In the final answer list changed areas and check results.
- For UI work, verify with Playwright/Chrome DevTools MCP on desktop and mobile viewports: no clipped/overlapping text, focus/hover/active states, no console errors. Use Figma MCP when given a design (treat it as a reference, adapt to FSD, local components, Tailwind and i18n); use Context7 for library docs (`resolve-library-id` first, then `query-docs`); use Next DevTools MCP (`.mcp.json`, versions pinned) to diagnose the running dev server.
