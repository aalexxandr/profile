# Proposal

## Why

The `CI` workflow hangs repeatedly in the `pnpm test:e2e` step: Playwright prints `Running 104 tests using 2 workers`, shows 96 progress dots and then nothing, for 20 minutes up to more than 2 hours (runs `43038643111` and `43846928456`). Locally the same suite takes seconds, and the workflow and `playwright.config.ts` set no timeout anywhere, so a stuck run only ends at GitHub's default 6-hour job limit and burns runner minutes. Since the move to pnpm/Playwright (2026-11-11) no CI run has completed e2e: the earlier runs failed earlier, in `playwright install --with-deps`, after 7-11 minutes of apt network failures.

The root cause of the hang is not yet confirmed (see design.md), so the change both bounds every step and makes the next hang diagnosable.

## What Changes

- Add time limits to the CI job and to its slow or network-dependent steps (`playwright install`, `test:e2e`) so a stuck step fails fast with a clear message.
- Add Playwright time limits (`globalTimeout`, per-test `timeout`, `expect` timeout, web server shutdown) that fail the run instead of waiting forever.
- Make the CI test output show per-test progress (a `list` reporter next to the `html` report), so the log shows which test was last started when a run stalls.
- Stop relying on `next start` with `output: "standalone"` in CI (Next.js itself warns that it does not work) and start the built standalone server directly, with a defined, bounded shutdown.
- Make the browser installation resilient to transient apt/network failures (split system dependencies from the browser download, retry, cache the browser).
- Cancel superseded runs of the same branch (`concurrency`), so stuck re-runs do not pile up.
- Update `CLAUDE.md` and `README.md` where they describe CI and e2e.

## Capabilities

### New Capabilities

- `ci-pipeline`: Guarantees about the CI workflow itself: every step has a bounded duration, a stalled end-to-end run fails with a diagnosable log instead of hanging, and the e2e server is started and stopped deterministically.

### Modified Capabilities

None. The application behavior (routes, pages, API contract) does not change.

## Impact

- `.github/workflows/ci.yml` (timeouts, concurrency, install step, e2e step, reporter env).
- `playwright.config.ts` (timeouts, reporter, web server command and shutdown).
- Possibly a small script for starting the standalone server (copying `public` and `.next/static`), and its unit test.
- `CLAUDE.md`, `README.md` (commands and CI description).
- No runtime dependency changes; at most one third-party GitHub Action for retries (to be pinned), or none if a shell retry is used.

**Out of scope:** changing what the e2e tests assert or adding tests for pages; the backend or stub API contract; changing the hosting or deployment pipeline; replacing Playwright; fixing the unrelated lint/typecheck steps; deleting local stray processes on a developer machine.
