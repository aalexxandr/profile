import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
// The stub stands in for the backend: the app is built against it, so E2E
// never depends on the real data.
const STUB_PORT = 3101;
const STUB_API_URL = `http://localhost:${STUB_PORT}`;
const isCI = Boolean(process.env.CI);
const MINUTE = 60_000;
const STANDALONE_START =
  "node_modules/.bin/tsx scripts/prepare-standalone.ts && exec node .next/standalone/server.js";

export default defineConfig({
  testDir: "./e2e",
  // A stalled run must fail instead of waiting for the CI platform limit; the
  // whole run is capped only in CI, where a hang costs runner minutes.
  timeout: 30_000,
  expect: { timeout: 5_000 },
  globalTimeout: isCI ? 5 * MINUTE : 0,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  // `list` names every test, so the log of a stalled run shows which ones
  // never finished.
  reporter: isCI ? [["github"], ["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: "exec node_modules/.bin/tsx scripts/stub-api/server.ts",
      url: `${STUB_API_URL}/cases`,
      env: { API_URL: STUB_API_URL },
      // CI starts the stub before its build step and the tests reuse it.
      reuseExistingServer: true,
      gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
      timeout: 30_000,
    },
    {
      // CI builds in a dedicated step before running the tests. Locally the
      // persistent fetch cache is dropped first: it would otherwise keep the
      // responses of an older stub and bake stale case data into the build.
      // The standalone server is the one the build supports (`next start` does
      // not work with `output: "standalone"`); `exec` makes it the process
      // Playwright signals, so no child outlives the run.
      command: isCI
        ? STANDALONE_START
        : `rm -rf .next/cache/fetch-cache && pnpm build && ${STANDALONE_START}`,
      url: baseURL,
      env: { API_URL: STUB_API_URL, PORT: String(PORT) },
      reuseExistingServer: !isCI,
      gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
      timeout: 240_000,
    },
  ],
});
