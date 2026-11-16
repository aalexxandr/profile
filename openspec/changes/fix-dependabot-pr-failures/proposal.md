# Proposal

## Why

An audit of the failed CI runs of the open and merged pull requests found three failures that come from the repository itself and will come back on every Dependabot cycle:

- **React pair split (PR #29).** Dependabot bumped `react` to 19.3.1 in one PR and left `react-dom` at 19.3.0. Both are pinned to exact versions, and React refuses to start with different versions, so 43 test suites failed with `Incompatible React versions`.
- **`lottie-react` 3.x (PRs #31, #23).** The new major removes the default export and `LottieRefCurrentProps`, renames `animationData` to `src` and `onComplete` to a subscription, so `CatPaws.tsx` and `Coffee.tsx` fail typecheck (`TS2305`, `TS2613`). The dependency stays on `^2.4.1` and cannot be updated.
- **Toolchain majors that the ecosystem does not support yet (PRs #22, #13, #25).** `eslint` 10 breaks `eslint-plugin-react` (`getFilename is not a function`) and `typescript` 7 breaks `@typescript-eslint/typescript-estree` (`Cannot read properties of undefined (reading 'Cjs')`). Dependabot proposes them anyway, and each PR then fails lint.

The remaining failures (PRs #33, #32, #30, #28, #27) were the Playwright browser installation on the runner and are already handled by `fix-ci-e2e-hang`.

## What Changes

- Group `react` and `react-dom` in `.github/dependabot.yml`, so they are always updated in one PR.
- Ignore semver-major updates of `eslint` and `typescript` in Dependabot until their plugins support them; a comment in the file says why and when to remove the rule.
- Migrate the two home-page animation components (`CatPaws`, `Coffee`) to the `lottie-react` 3.x API with identical visible behavior, and raise the dependency to `^3.1.2`.
- Add unit tests for both components (they have none), including the paws playing forward, then backward, then forward again on every completion.
- Update `README.md` and `CLAUDE.md` where they describe Dependabot and the animations' dependency.

## Capabilities

### New Capabilities

- `dependency-updates`: How automated dependency updates are shaped so that they can pass CI on their own: tightly coupled packages are updated together, and major versions the toolchain cannot run yet are not proposed.
- `home-animations`: The two decorative home-page animations: the coffee cup plays in a loop, the cat paws play forward and backward alternately without stopping, and neither blocks or breaks the page.

### Modified Capabilities

None. Existing specs (`backend-api-contract`, `case-details`, `cases-catalog`) are not affected.

## Impact

- `.github/dependabot.yml`.
- `src/views/home/ui/CatPaws.tsx`, `src/views/home/ui/Coffee.tsx`, plus their new tests; possibly a small hook or helper for the paws direction toggle, placed according to the FSD segments of `views/home`.
- `package.json` and `pnpm-lock.yaml` (`lottie-react` to `^3.1.2`).
- `README.md`, `CLAUDE.md`.
- Unlike the CI change, this one touches runtime UI code, so it needs a visual check of the home page on desktop and mobile.

**Out of scope:** closing the obsolete bun-based Dependabot PRs (#22-#26) and asking Dependabot to rebase #32, #30 and #28 (actions on GitHub, not repository changes, done separately); updating `eslint`, `typescript` or any other package to a new major; the CI hang and Playwright installation (`fix-ci-e2e-hang`); changing the animation files, their size or placement on the page; adding Dependabot groups beyond React.
