# Tasks

## 1. Time limits and diagnostics

- [x] 1.1 Red: add a unit test (Vitest, reading `.github/workflows/ci.yml` and `playwright.config.ts`) that fails while the job has no `timeout-minutes` <= 20, the install and e2e steps have no own `timeout-minutes`, there is no `concurrency` with `cancel-in-progress`, or the config lacks `timeout`, `expect.timeout` and a CI `globalTimeout`; verify it fails for exactly those reasons
- [x] 1.2 Green: add `timeout-minutes` (job 20, install 10, e2e 8) and `concurrency` to `ci.yml`; add `timeout`, `expect.timeout` and the CI-only `globalTimeout` to `playwright.config.ts`; verify the test from 1.1 passes
- [x] 1.3 Red/green: add a test that the CI reporter list contains `list` and `html`; switch the CI reporter to `[["github"], ["list"], ["html", { open: "never" }]]`; verify with `CI=1 pnpm exec playwright test --list` and the unit test
- [x] 1.4 Change the report upload to `if: always()`; verify the YAML still parses (`pnpm exec prettier --check .github/workflows/ci.yml`) and that the unit test covers the condition

## 2. Deterministic e2e server

- [x] 2.1 Red: write a unit test for a start-script helper that, for a build output directory, reports whether `public` and `.next/static` are present beside `.next/standalone/server.js` and builds the server command with `PORT`; verify it fails because the helper does not exist
- [x] 2.2 Green: implement the helper and the script in `scripts/` (copy `public` and `.next/static` into the standalone folder when missing, then run `node .next/standalone/server.js`); verify the unit test passes
- [x] 2.3 Use the script as the CI web server command in `playwright.config.ts` and set `gracefulShutdown` (SIGTERM, short timeout) on it; keep the local build-and-start flow working; verify with a clean local `CI=1 pnpm test:e2e` after freeing port 3100 that all tests pass, the `next start ... standalone` warning is gone, and `lsof -i :3100` is empty after the run
- [x] 2.4 Verify the shutdown guarantee by running the e2e command twice in a row locally and confirming the second run starts without "port already used" and leaves no `next-server` or `node .next/standalone/server.js` process

## 3. Resilient browser installation

- [x] 3.1 Split the install into `playwright install-deps chromium` and `playwright install chromium`, each in a bounded shell retry (fixed attempt count, short pause), and add a cache for `~/.cache/ms-playwright` keyed by the Playwright version from `pnpm-lock.yaml`; verify the YAML is valid and the retry helper (extracted to a script if it is more than a one-liner) has a unit test for "fails twice, then succeeds" and "fails every time"
- [x] 3.2 Pin any third-party action used for the cache to an exact version; verify with `grep` that no `@main`/floating tag is introduced

## 4. Documentation and end-to-end check

- [x] 4.1 Update `CLAUDE.md` (Commands, Automation, Verification) and `README.md` for the CI limits, the standalone e2e server, the retry/cache and the `list` reporter; verify no section still says `pnpm start` serves e2e in CI
- [x] 4.2 Run `pnpm check`, `pnpm fsd:check` (report an `EMFILE` failure as an environment blocker) and `pnpm test:e2e`; verify all pass
- [ ] 4.3 Push the branch and verify on GitHub: the CI run completes within the limits, the log shows per-test lines, and the e2e step ends on its own; if it stalls again, confirm the step fails at its limit, the report artifact is uploaded, and record the unfinished tests from the log for a follow-up

## Workflow follow-up

- Cancel the stuck runs `43846928456` and `43038643111` (`gh run cancel`) once the change is merged or before re-running CI.
- Archive the change after review.
