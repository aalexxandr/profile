import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
// The stub stands in for the backend: the app is built against it, so E2E
// never depends on the real data.
const STUB_PORT = 3101;
const STUB_API_URL = `http://localhost:${STUB_PORT}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
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
      command: "bun run stub:start",
      url: `${STUB_API_URL}/cases`,
      env: { API_URL: STUB_API_URL },
      // CI starts the stub before its build step and the tests reuse it.
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      // CI builds in a dedicated step before running the tests.
      command: isCI ? "bun run start" : "bun run build && bun run start",
      url: baseURL,
      env: { API_URL: STUB_API_URL, PORT: String(PORT) },
      reuseExistingServer: !isCI,
      timeout: 240_000,
    },
  ],
});
