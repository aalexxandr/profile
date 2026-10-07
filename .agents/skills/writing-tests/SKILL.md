---
name: writing-tests
description: 'Write and run tests for this Next.js project (Vitest + React Testing Library for units, Playwright for E2E). Use whenever you add or change functionality, fix a bug, add a route, hook, component, helper or dictionary key, or when asked to add/improve tests. Covers where tests live, which level to use, ready patterns (fake timers, next/navigation mocks, env stubbing, redirects, keyboard flows), known pitfalls and the definition of done.'
---

# Writing tests

## The rule

**Every new functionality, behavior change and bug fix ships with tests in the same change.** Do not finish a task, and do not say it is done, until the tests are written, pass, and were checked to actually fail when the behavior breaks. "I will add tests later" is not an option. If something truly cannot be tested, say what and why in the final answer.

## Pick the level

| What you changed                                                                      | Test it with                                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Pure function, config, data, dictionary, metadata/sitemap/robots builder              | Vitest unit test next to the file                                                     |
| Hook with timers/effects/observers                                                    | Vitest `renderHook` or a tiny harness component                                       |
| Sync client or server component, a11y attributes, interactions                        | Vitest + React Testing Library                                                        |
| `async` Server Component, `proxy.ts`, routing, redirects, 404s, real metadata in HTML | Playwright E2E (Vitest cannot render async RSC)                                       |
| Keyboard flows, navigation, language switching, links between pages                   | Playwright E2E                                                                        |
| New route                                                                             | unit test for `generateStaticParams`/sitemap + E2E page in `e2e/support/routes.ts`    |
| New user-facing string                                                                | nothing extra: dictionary tests already check empty strings and ru/en key parity      |
| New locale | dictionary tests check key parity and empty strings; add the locale to the E2E lists and to `e2e/support/routes.ts` |

When in doubt, test the logic as a unit **and** the user-visible behavior in E2E. Test behavior (roles, text, URLs, ARIA attributes), not implementation details like state variable names.

## Workflow

1. **Bug fix:** write the failing test first, see it fail for the right reason, then fix the code, see it pass.
2. **New feature:** write tests with the code. If logic is trapped inside a component, extract it to `lib/` (a helper or `useSomething` hook) so it can be tested directly; this matches the project conventions.
3. **Prove the tests bite:** temporarily break the implementation (flip a condition, drop a `clearTimeout`, hardcode an attribute), confirm the new tests fail, then restore the code. Only restore with `git checkout <file>` when that file has no other uncommitted work; otherwise undo the edit by hand.
4. **Run:** `bun run test`, then `bun run check` (CI runs `bun run test:coverage`: if you add code, add tests so the global thresholds in `vitest.config.mts` still hold; never lower thresholds to pass); plus `bun run fsd:check` for placement/import changes and `bun run test:e2e` for routing, `proxy.ts`, navigation or UI-flow changes. Commit only when everything is green (chain with `&&`, never commit after a failed check).
5. **Report:** list the tests you added and the check results in the final answer.

## Conventions

- Unit tests are colocated: `foo.ts` → `foo.test.ts`, `Bar.tsx` → `Bar.test.tsx`. Vitest picks up `src/**/*.test.{ts,tsx}`. E2E specs live in `e2e/*.spec.ts`.
- Globals are off: import `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` from `vitest`. DOM cleanup and `jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`, `toHaveClass`) are set up in `vitest.setup.ts`.
- Use the `@/` alias, `import type` for types, no `any`, no deep `../../` imports. Strict TS applies to tests too (`noUncheckedIndexedAccess` is on: `array[0]` may be `undefined`).
- Use `it.each` / `describe.each` for locale and input matrices. Name tests by behavior ("keeps the path and the query string"), not by function.
- Keep fixtures local to the test. Do not deep-import another layer's internals just to build a fixture (it can break `fsd:check`); build the small object in the test and type it with the public `Dictionary`/`NavigationItem` types.
- Test both locales (`ru`, `en`) when text, paths or metadata are involved.

## Already handled for you (do not mock again)

- `*.svg?svgr` imports render a plain `<svg>` (plugin in `vitest.config.mts`).
- `server-only` resolves to an empty module (same config), so `get-dictionary.ts` and `metadata.ts` can be imported.
- `@/` alias works through `resolve.tsconfigPaths`.
- E2E: remote images (`/_next/image`, `picsum.photos`) are stubbed by the `page` fixture in `e2e/support/test.ts`, so tests do not need the internet.

## Unit patterns

**Env / config helpers**

```ts
afterEach(() => vi.unstubAllEnvs());

it("throws in production without a site url", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.stubEnv("NODE_ENV", "production");
  expect(() => getSiteUrl()).toThrow("NEXT_PUBLIC_SITE_URL is required");
});
```

**Hook with timers**

```ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const { result, unmount } = renderHook(() => useRetroWindowAnimation());
act(() => result.current.toggleFullScreen());
act(() => vi.advanceTimersByTime(799)); // test both sides of a boundary
expect(vi.getTimerCount()).toBe(0); // no leaked timers after unmount
```

**Mocking `next/navigation`** (hoist the mock fn so the factory can use it)

```ts
const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname }));
beforeEach(() => usePathname.mockReset());
usePathname.mockReturnValue("/ru/cases");
```

For `notFound()` mock it so it **throws** (the real one does) and assert with `rejects.toThrow`.

**`next/image`**: mock it to a plain `<img alt={alt} />` (add `// eslint-disable-next-line @next/next/no-img-element`).

**Third-party animation libs** (e.g. `react-simple-typewriter`): mock them with a stub that renders its props; test your wrapper's logic, not the library.

**Observers / layout** (`ResizeObserver`, `getBoundingClientRect`): `vi.stubGlobal("ResizeObserver", FakeObserver)` with a `trigger()` method and `vi.spyOn(Element.prototype, "getBoundingClientRect")`; undo with `vi.restoreAllMocks()` and `vi.unstubAllGlobals()` in `afterEach`. Assert object identity (`toBe`) to prove "no state change", not render counts (React may render once more before bailing out).

**Components**: query by role and accessible name (`getByRole("button", { name })`). Content with `aria-hidden="true"` is invisible to role queries: use `getByText` or a locator for it.

## E2E patterns

- Import `test` and `expect` from `./support/test`, not from `@playwright/test`. It gives you the stubbed-images `page` and a `consoleErrors` fixture (assert `expect(consoleErrors).toEqual([])` on pages that must be clean).
- Use `baseURL`-relative paths (`page.goto("/ru/cases")`). Add every new page to `e2e/support/routes.ts` so smoke, metadata and link-check tests cover it automatically.
- Locate like a user: `getByRole(..., { name })` with names from the dictionaries. Never `waitForTimeout`; use web-first assertions (`await expect(locator).toHaveAttribute(...)`), they retry.
- HTTP-level checks (redirects, 404s, pass-through paths) use the `request` fixture with `maxRedirects: 0` and read `status()` and the `location` header; proxy redirects are `307`.
- Keyboard flows: `locator.focus()` then `page.keyboard.press("Enter" | "Space" | "Tab")`.
- Specs run on both `desktop` and `mobile` projects; write them viewport-agnostic.
- Do not name a fixture callback parameter `use` (the React hooks ESLint rule flags it); we use `provide`.
- `bun run test:e2e` builds and serves the app on port 3100 itself (`bunx playwright install chromium` once per machine). It is not part of `bun run check`.

## Pitfalls we already hit

- `userEvent` hangs under Vitest fake timers (RTL only patches timers when it sees a global `jest`). Under fake timers use `fireEvent`; use `userEvent` with real timers (call `vi.useRealTimers()`).
- The `check` script and CI run tests, so a type error in a test file fails the build. After changing a shared type (like `Dictionary`) update the test fixtures too.
- `vite-tsconfig-paths` is not needed (and noisy); the alias is native.
- `next start` serves the last build: after changing source, rebuild before running E2E by hand (`bun run test:e2e` does it for you locally).
- Next logs `Error: Internal: NoFallbackError` for unknown paths under `dynamicParams = false`; that is normal when an E2E test requests a 404.
- Mutations check: remember that a green run proves nothing until you saw the test fail without the behavior.

## What not to test

Thin route files that only compose (`src/app/[locale]/*/page.tsx`) beyond what E2E covers, decorative SVG/Lottie assets, `Reveal`/`Button` as isolated units (covered through the pages that use them), and third-party library internals.

## Definition of done

- [ ] New/changed behavior has unit and/or E2E tests; bug fixes have a regression test that failed before the fix
- [ ] Both locales covered where text, paths or metadata are involved
- [ ] You saw the tests fail when the behavior is broken
- [ ] `bun run test` and `bun run check` pass (and `fsd:check` / `test:e2e` where relevant)
- [ ] Final answer lists the added tests and the check results
