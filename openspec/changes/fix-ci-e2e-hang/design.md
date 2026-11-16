# Design

## Context

See proposal.md for motivation. Current state, as observed:

- `ci.yml` has one job (`check`, `ubuntu-24.04`) with no `timeout-minutes` and no `concurrency`. The stub API is started by an earlier step with `pnpm stub:start &`; the build also happens in an earlier step.
- In CI, `playwright.config.ts` starts the app with `pnpm start`, which is `next start`, while `next.config.ts` sets `output: "standalone"`; the log prints that this combination "does not work". Locally the config builds and starts the same way, and `reuseExistingServer: !isCI`.
- The config has no `timeout`, `expect.timeout`, `globalTimeout` or web server `gracefulShutdown`. CI uses `workers: 2`, `retries: 1` and the `github` + `html` reporters, which print only dots, so a stall shows no test names.
- A local full run passes (112 tests in about 7 s), but that run reused a server that was already listening on port 3100, so it is not a clean reproduction. A stray `next-server` with parent PID 1, left from an earlier Playwright run, was found on the developer machine: the child of `pnpm start` can outlive Playwright.
- Hang point is unconfirmed: 96 of 104 tests had printed a dot, so either 8 tests never finished, or all finished and the process does not exit (web server teardown). No CI log distinguishes the two.

## Goals / Non-Goals

**Goals:**

- No CI step can run longer than a small, explicit limit.
- If the e2e step stalls again, its log identifies the unfinished tests and whether teardown was reached.
- Remove the known-invalid server setup (`next start` with `standalone`) as the most plausible cause of a teardown stall.
- Make browser installation survive transient mirror outages.

**Non-Goals:**

- Proving the root cause before shipping the limits. The limits are valuable on their own, and the diagnostics decide whether anything else is needed.
- Changing test content, parallelism strategy beyond what a limit needs, or the runner image.
- Reworking the local developer flow (`pnpm test:e2e` still builds and serves by itself).

## Decisions

1. **Bound everything, at three levels.** Job `timeout-minutes: 20`, install step `10`, e2e step `8`; Playwright `timeout: 30_000` per test, `expect.timeout: 5_000`, `globalTimeout` 5 minutes in CI (unset locally). Each inner limit is smaller than the outer one so the inner one fires first and produces the more specific message. Alternative: only a job limit. Rejected: it would end a stall but report nothing about where it happened.

2. **Add the `list` reporter in CI next to `html`** (keep `github` for annotations). Per-test lines are what turns "96 dots then silence" into a named set of unfinished tests. Alternative: `trace: on` for everything. Rejected: heavy, and does not help when the run never reaches reporting.

3. **Serve the standalone output directly in CI.** Use `node .next/standalone/server.js` with `PORT`, after making sure `public/` and `.next/static` are present next to it (the standalone folder does not copy them). Put this in a small script so both the config and CI use one definition. Alternative: remove `output: "standalone"`. Rejected: it exists for deployment, and changing it is outside this change. Alternative: keep `next start` and ignore the warning. Rejected: the warning says the setup is unsupported, and the extra `pnpm` -> `sh` -> `next` process chain is the likeliest source of orphaned children.

4. **Make the web server shutdown explicit.** Set `gracefulShutdown` (SIGTERM with a short timeout) on the app web server, and run the server as a direct node process so the signal reaches it. Alternative: a `pkill` step after the tests. Rejected as a workaround that hides the leak.

5. **Retry installation, cache the browser.** Install system dependencies and the browser as two commands, wrap each in a bounded retry (shell loop with a fixed attempt count, so no new third-party action is required), and cache `~/.cache/ms-playwright` keyed by the Playwright version from the lockfile. Alternative: a prebuilt Playwright container image. Rejected for now: a larger change in how the job runs.

6. **`concurrency` with `cancel-in-progress`** per workflow and ref, so re-runs and pushes do not stack stuck jobs.

7. **Upload the report `if: always()`** (it is `if: failure()` today), so a timed-out step, which is a failure, and a cancelled run keep their artifacts. Only the e2e step produces them, so a missing folder is already a warning, not an error.

## Risks / Trade-offs

- [The stall is not caused by the server setup] -> Decisions 1 and 2 still cap it and name the unfinished tests; a follow-up change would then target that test or Chromium, with data.
- [A 5-minute `globalTimeout` is too tight on a slow runner] -> A healthy run takes seconds; set the limit from the first measured CI duration (a few times the typical value), and keep it in one constant.
- [A standalone start script drifts from what the deployment does] -> It only serves the same build output; it documents the copy of `public` and `.next/static`, and has a unit test.
- [Retries hide a real outage] -> A fixed small attempt count, and the failure still surfaces after the last attempt.
- [Cache keyed by version serves a stale browser] -> The key includes the Playwright version; a mismatch is a cache miss.

## Migration Plan

Single PR. Order: limits and reporter first (they alone make the next stall diagnosable), then the standalone server, then install resilience. If the standalone start misbehaves, reverting that one commit returns to `pnpm start` without losing the limits.
