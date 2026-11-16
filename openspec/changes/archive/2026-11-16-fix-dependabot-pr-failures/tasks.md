# Tasks

## 1. Dependabot configuration

- [x] 1.1 Red: add `scripts/dependabot-config.test.ts` that reads `.github/dependabot.yml` and fails unless the `npm` entry has a group listing `react` and `react-dom`, and ignore rules for `eslint` and `typescript` limited to `version-update:semver-major`; verify it fails for exactly those reasons
- [x] 1.2 Green: add the React group and the two major-version ignore rules, with a comment giving the reason and the removal condition, to `.github/dependabot.yml`; verify the test from 1.1 passes and `pnpm exec prettier --check .github/dependabot.yml` is clean
- [x] 1.3 Update the Dependabot line in `README.md` (and `CLAUDE.md` if it mentions Dependabot) to describe the grouping and the ignored majors; verify with `grep` that no text claims plain per-package updates

## 2. Migrate the animations to `lottie-react` 3.x

- [x] 2.1 Raise `lottie-react` to `^3.1.2` with `pnpm add lottie-react@^3.1.2`, then read the installed type definitions and record the exact 3.x names to use (component and handle types, the `subscriptions` key for completion, the type of `direction`); verify `pnpm typecheck` fails only in `CatPaws.tsx` and `Coffee.tsx` with the known errors
- [x] 2.2 Red: write `Coffee.test.tsx` with `lottie-react` mocked, asserting `src`, `loop`, `autoplay` and `className` are passed to `Lottie`; verify it fails against the current component
- [x] 2.3 Green: migrate `Coffee.tsx` (named import, `src`, explicit `loop` and `autoplay`); verify `Coffee.test.tsx` passes
- [x] 2.4 Red: write unit tests for the paws direction hook in `views/home/lib` (first pass forward, each completion calls `setDirection` with the opposite value and then `play`, several completions alternate) and `CatPaws.test.tsx` (not looping, autoplay, `className`, completion handler wired); verify they fail because the hook and the new component do not exist
- [x] 2.5 Green: implement the hook and migrate `CatPaws.tsx` to use it (component stays declarative, no inline logic); verify the tests from 2.4 pass, `pnpm typecheck` is clean and `pnpm lint` has no new warnings
- [x] 2.6 Check the home page with the Playwright MCP on a desktop and a mobile viewport, comparing it with `main` (layout unchanged, both animations visible and moving, the paws changing direction, no console errors, locales `ru` and `en`); verify with screenshots and the console log, and fix any difference found before continuing
- [x] 2.7 Add an e2e check that the home page renders both animations (an `svg` inside each container) in `ru` and `en`; verify it passes with `pnpm test:e2e`

## 3. Documentation and integration check

- [x] 3.1 Update `README.md` and `CLAUDE.md` where `lottie-react` or the home-page animations are described; verify no text mentions the 2.x API (`animationData`, `onComplete`, `LottieRefCurrentProps`)
- [x] 3.2 Run `pnpm check`, `pnpm fsd:check` (report an `EMFILE` failure as an environment blocker) and `pnpm test:e2e`; verify all pass
- [x] 3.3 After the branch is pushed, verify on GitHub that CI is green on the updated `lottie-react`, and that a rebased Dependabot PR for `react` now arrives as one PR for both packages

## Workflow follow-up

- Outside this change, on GitHub: close the obsolete bun-based Dependabot PRs (#22-#26, keeping the green #24 and #26 for re-creation under pnpm), comment `@dependabot rebase` on #32, #30 and #28, and close #31 and #23 once the migration is merged.
- Archive the change after review.
