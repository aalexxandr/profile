# Design

## Context

See proposal.md for the failures that motivate the change. Current state:

- `.github/dependabot.yml` has two ecosystems (`npm`, `github-actions`), both weekly, with no groups and no ignore rules. `package.json` pins `react` and `react-dom` to the exact `19.3.0` and has `eslint` `^9`, `typescript` `^5`, `lottie-react` `^2.4.1` (lock: 2.4.2).
- `lottie-react` is used in two client components of `views/home`: `Coffee` (`<Lottie animationData loop autoplay className />`) and `CatPaws` (`lottieRef` typed `LottieRefCurrentProps`, `loop={false}`, `autoplay`, an `onComplete` handler that flips a direction ref between 1 and -1, calls `setDirection` and `play`). The animation JSON lives in `views/home/ui/assets/lottie-animations/`. Neither component has a test; the home page is covered only by the generic page e2e (`pages.spec.ts`: status, metadata, no console errors).
- `lottie-react` 3.x, from the library documentation (Context7, `/gamote/lottie-react`): named exports (`Lottie`, `LottieHandle`, `LottieSubscription`, `LottieProps`); the animation is passed as `src` (URL or parsed object); `loop` and `autoplay` default to `false`; `direction` is `"forward" | "reverse"`; events are `subscriptions` (and `LottieSubscription.complete`) instead of `onComplete`; `lottieRef` is a `Ref<LottieHandle>` with `play()`, `setDirection(direction)` and other commands.

## Goals / Non-Goals

**Goals:**

- A Dependabot configuration under which a React bump and the toolchain majors cannot produce a PR that is red for a known reason.
- `lottie-react` 3.x with the same visible behavior as 2.x.
- Tests that make both changes safe to repeat (config guard, component behavior).

**Non-Goals:**

- Auditing other dependencies for upcoming majors, or adding more groups.
- Changing the animations, their timing, size or placement.
- Handling the GitHub-side cleanup of existing PRs.

## Decisions

1. **Group `react` and `react-dom` by name patterns** in the `npm` ecosystem (`groups.react.patterns: [react, react-dom]`). Alternative: loosen the exact pin of `react-dom`. Rejected: the exact pin is deliberate, and React itself requires equal versions. Alternative: manually bump both each time. Rejected: that is the failure being fixed.

2. **Ignore only `version-update:semver-major` for `eslint` and `typescript`**, not the packages entirely, so security and minor/patch updates keep coming. A comment records the reason (`eslint-plugin-react` and `typescript-eslint` support) and the removal condition. Alternative: pin both packages exactly in `package.json`. Rejected: it blocks minor and patch updates and hides the intent in a lockfile detail.

3. **Guard the config with a text-based Vitest test** (`scripts/dependabot-config.test.ts`) that reads `.github/dependabot.yml` and asserts the group and the two ignore rules, in the style of `scripts/ci-config.test.ts`. Alternative: add a YAML parser as a dev dependency. Rejected: a new dependency for three assertions; the file is small and the checks are line-level.

4. **Migrate the two components in place and keep the toggling logic out of the JSX.** `Coffee` becomes `<Lottie src={coffee} loop autoplay className={className} />` (explicit `loop` and `autoplay` because the defaults changed to `false`). For `CatPaws`, the forward/backward state moves to a small hook in `views/home/lib` that owns the direction and returns the `subscriptions` object and the `lottieRef`; the component only renders. This follows the project rule that components stay declarative and that logic lives in hooks, and it makes the logic testable without the library. Alternative: use `direction` as a prop with React state. Rejected for the paws: a state change on every completion re-renders and risks restarting the animation; the imperative handle (`setDirection` + `play`) is what 2.x did and is the documented 3.x command set.

5. **Confirm exact 3.x names from the installed type definitions before coding.** The documentation excerpts show `subscriptions`, `LottieSubscription.complete` and `LottieHandle`, but their exact shape (for example the key under `subscriptions` and the type of `direction`) must be read from `node_modules/lottie-react` after the upgrade, because a wrong guess is caught by typecheck but could still behave differently. This is a task, not an open design question.

6. **Test the components with the library mocked**, asserting the props passed to `Lottie` (`src`, `loop`, `autoplay`, `className`) and, for the paws, that each completion calls `setDirection` with the alternating value and then `play`. Real playback is verified in the browser (Playwright MCP) and by the existing page e2e (no console errors on `/ru` and `/en`). Alternative: render the real library in happy-dom. Rejected: it needs canvas/SVG APIs that happy-dom does not implement, and would test the library rather than our logic.

## Risks / Trade-offs

- [3.x renders or measures differently, so the page shifts] -> Compare the home page before and after on desktop and mobile with Playwright MCP screenshots; keep `className` and the wrapper elements unchanged.
- [3.x changes how SSR or client loading works, causing a hydration warning] -> Keep `"use client"`, check the console on both locales in dev and in the production build, and rely on the page e2e that fails on console errors.
- [3.x has no accessibility attributes, or adds some] -> The spec requires the animations to be decorative; check the rendered DOM and add `aria-hidden` explicitly only if the library does not provide it.
- [Ignoring majors hides a needed upgrade] -> The comment states the removal condition; a periodic check is a manual follow-up outside this change.
- [Mocked unit tests drift from the real library] -> They only assert our own contract (props and handle calls); the browser check covers the library.

## Migration Plan

One PR. Order: Dependabot config and its test (independent, safe), then the library upgrade with the component migration, then docs. The upgrade can be reverted on its own by restoring `^2.4.1`, the old imports and the old lockfile entry.
