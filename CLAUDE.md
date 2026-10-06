# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`docs/ai/*` (project overview, coding standards, checklists, MCP playbook) are the primary project rules — read them. They are written in Russian. Key points are summarized here.

## Commands

Package manager is `bun`. There is no test runner configured.

- `bun run dev` — dev server; `bun run build` / `bun run start` — production build / serve
- `bun run lint` (`lint:fix` to autofix), `bun run format:check` (`format` to write)
- `bun run check` — lint + format:check + build (run before finishing a change)
- `bun run fsd:check` — Steiger FSD lint. It may fail with `EMFILE: too many open files, watch`; report that as an environment blocker, not a pass.

## Next.js version warning

This is Next.js 16 (React 19, Tailwind 4) with breaking changes vs. older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code. For example, the middleware file is `src/proxy.ts` exporting `proxy` (not `middleware`).

## Architecture

- FSD-like layout in `src/`: `app` → `views` → `widgets` → `shared`. (Next's `app/` is the FSD app layer; pages live in `views/` and are composed by thin route files in `src/app`.) Use the `feature-sliced-design` skill for any placement/import/public-API decision.
- Imports use the `@/` alias (e.g. `@/shared/i18n`).
- **i18n routing**: all routes live under `src/app/[locale]/` (locales `ru`, `en`; config in `src/shared/i18n`). `src/proxy.ts` redirects unlocalized paths using the `Accept-Language` header. Server-only dictionary loading, metadata helpers and locale validation are in `src/shared/i18n-server` (dictionaries in `dictionaries/ru.ts` and `en.ts`).
- Every user-facing string, alt text, nav label and metadata goes through the dictionaries: add keys to **both** `ru` and `en` and to the dictionary type.
- `src/app/_layout/SiteLayout.tsx` holds site-wide layout composition.
- SVGs imported with the `?svgr` query are converted to React components via `@svgr/webpack` (Turbopack rule in `next.config.ts`). Remote images are only allowed from `picsum.photos`.

## Keeping docs current

When a change alters the project architecture (layers/slices, `src` structure, routing, i18n, key dependencies, MCP servers, commands), update `CLAUDE.md`, `README.md` and `docs/ai/*` in the same change so they never describe outdated structure.

## Code conventions

- Server Components by default; add `"use client"` only for hooks, browser APIs, events, animations, or client-only libs, and keep it as low in the tree as possible.
- Strict TypeScript, no `any`. Keep JSX declarative: move non-trivial logic into hooks/helpers; use `clsx` for conditional Tailwind classes.
- For UI work, verify with Playwright/Chrome DevTools MCP; use Figma MCP when given a design; use Context7 for library docs (`resolve-library-id` first, then `query-docs`); use Next DevTools MCP (`.mcp.json`) to diagnose the running dev server.
