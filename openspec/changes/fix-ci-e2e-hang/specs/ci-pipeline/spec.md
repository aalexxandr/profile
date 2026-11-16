# Spec Delta

## Purpose

Defines the reliability guarantees of the CI workflow: bounded step durations, diagnosable stalls in the end-to-end run, and deterministic start and stop of the servers it uses.

## ADDED Requirements

### Requirement: Every CI step has a bounded duration

The CI job and each step that installs dependencies or runs tests SHALL have an explicit time limit well below GitHub's default, so a stalled step fails the run instead of waiting for the platform limit.

#### Scenario: Job limit

- **WHEN** the CI workflow is read
- **THEN** the `check` job declares a `timeout-minutes` value of at most 20

#### Scenario: Slow steps have their own limit

- **WHEN** the workflow steps that install the Playwright browser or run `pnpm test:e2e` are read
- **THEN** each declares its own `timeout-minutes`, smaller than the job limit

#### Scenario: Superseded runs are cancelled

- **WHEN** a new commit is pushed to a branch that already has a CI run in progress
- **THEN** the older run of the same workflow and branch is cancelled

### Requirement: Playwright run is bounded

The Playwright configuration SHALL define a global run limit, a per-test limit and an assertion limit, so that a run in which some tests never finish ends with a failure.

#### Scenario: A test never finishes

- **WHEN** a test does not complete within its per-test limit
- **THEN** it is reported as timed out and the remaining tests continue

#### Scenario: The whole run stalls

- **WHEN** the run exceeds the global limit in CI
- **THEN** Playwright stops, reports the unfinished tests and exits with a non-zero code

### Requirement: Stalled runs are diagnosable

In CI the test output SHALL name every test when it starts or finishes, so the log of a stalled run shows which tests were unfinished.

#### Scenario: Stall in the log

- **WHEN** an e2e run is stopped by a time limit
- **THEN** the log lists the tests that passed, and the test titles that were running or not yet finished

#### Scenario: Report is kept

- **WHEN** the e2e step fails or times out
- **THEN** the HTML report and test results are still uploaded as an artifact

### Requirement: E2E server starts and stops deterministically

CI SHALL serve the production build for e2e with a command that is valid for the project's `standalone` output, and Playwright SHALL stop it, with all its child processes, within a bounded time after the tests finish.

#### Scenario: Serving the build

- **WHEN** the e2e step starts the application server in CI
- **THEN** it uses the standalone server of the build and no warning that `next start` does not work with `output: "standalone"` is printed

#### Scenario: Shutdown

- **WHEN** the tests have finished
- **THEN** no server process started for the run is still alive, and the `pnpm test:e2e` command exits without waiting for them

### Requirement: Browser installation tolerates transient network failures

CI SHALL retry the installation of system dependencies and the Playwright browser a limited number of times before failing, and SHALL cache the downloaded browser between runs.

#### Scenario: Transient apt failure

- **WHEN** the first attempt to install system dependencies fails because a mirror cannot be reached
- **THEN** the step is retried, and the job continues if a later attempt succeeds

#### Scenario: Persistent failure

- **WHEN** all attempts fail
- **THEN** the step fails within its time limit with the installer's error in the log
