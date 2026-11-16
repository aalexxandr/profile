import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

const workflow = readFileSync(
  resolve(__dirname, "../.github/workflows/ci.yml"),
  "utf8",
);

const loadPlaywrightConfig = async (ci: boolean) => {
  vi.resetModules();
  vi.stubEnv("CI", ci ? "1" : "");

  return (await import("../playwright.config")).default;
};

// The text of the workflow step whose `name:` line contains `name`.
const stepOf = (name: string) => {
  const steps = workflow.split(/\n(?=      - )/);
  const step = steps.find((candidate) => candidate.includes(name));

  expect(step, `step "${name}" is missing in ci.yml`).toBeDefined();

  return step ?? "";
};

const installSteps = () =>
  workflow
    .split(/\n(?=      - )/)
    .filter((step) => step.includes("playwright install"));

const timeoutOf = (text: string) =>
  Number(/timeout-minutes:\s*(\d+)/.exec(text)?.[1] ?? Number.NaN);

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("CI workflow limits", () => {
  it("limits the whole job to at most 20 minutes", () => {
    const jobHeader = workflow.slice(
      workflow.indexOf("  check:"),
      workflow.indexOf("    steps:"),
    );

    expect(timeoutOf(jobHeader)).toBeLessThanOrEqual(20);
  });

  it("gives the browser install steps and the e2e step their own, smaller limits", () => {
    const limits = [
      ...installSteps().map(timeoutOf),
      timeoutOf(stepOf("pnpm test:e2e")),
    ];

    expect(installSteps()).toHaveLength(2);

    for (const limit of limits) {
      expect(limit).toBeGreaterThan(0);
      expect(limit).toBeLessThan(20);
    }
  });

  it("retries the system dependencies and the browser installation", () => {
    for (const step of installSteps()) {
      expect(step).toMatch(/run:\s*sh scripts\/retry\.sh \d+ \d+ pnpm exec/);
    }
  });

  it("caches the browser by the lockfile with an exactly pinned action", () => {
    const cache = stepOf("~/.cache/ms-playwright");

    expect(cache).toMatch(/uses:\s*actions\/cache@v\d+\.\d+\.\d+/);
    expect(cache).toContain("hashFiles('pnpm-lock.yaml')");
  });

  it("cancels superseded runs of the same workflow and ref", () => {
    expect(workflow).toMatch(/^concurrency:/m);
    expect(workflow).toMatch(/cancel-in-progress:\s*true/);
  });

  it("uploads the e2e report even when the step times out", () => {
    expect(stepOf("name: playwright-report")).toMatch(/if:\s*always\(\)/);
  });
});

describe("Playwright config limits", () => {
  it("defines a per-test and an assertion limit", async () => {
    const config = await loadPlaywrightConfig(false);

    expect(config.timeout).toBeGreaterThan(0);
    expect(config.expect?.timeout).toBeGreaterThan(0);
  });

  it("limits the whole run in CI only", async () => {
    const ci = await loadPlaywrightConfig(true);
    const local = await loadPlaywrightConfig(false);

    expect(ci.globalTimeout).toBeGreaterThan(0);
    expect(ci.globalTimeout).toBeLessThanOrEqual(10 * 60_000);
    expect(local.globalTimeout ?? 0).toBe(0);
  });

  it("prints per-test lines and keeps the html report in CI", async () => {
    const config = await loadPlaywrightConfig(true);
    const names = (config.reporter as unknown as [string][]).map(
      ([name]) => name,
    );

    expect(names).toEqual(expect.arrayContaining(["list", "html"]));
  });

  it.each([true, false])(
    "serves the standalone build and stops it gracefully (CI: %s)",
    async (ci) => {
      const config = await loadPlaywrightConfig(ci);
      const servers = [config.webServer ?? []].flat();
      const app = servers.find((server) => server.url?.includes(":3100"));

      expect(app?.command).toContain(".next/standalone/server.js");
      expect(app?.command).not.toMatch(/pnpm start|next start/);
    },
  );

  it.each([true, false])(
    "runs every web server as a direct process that gets SIGTERM (CI: %s)",
    async (ci) => {
      const config = await loadPlaywrightConfig(ci);
      const servers = [config.webServer ?? []].flat();

      expect(servers.length).toBeGreaterThan(0);

      for (const server of servers) {
        // A `pnpm` wrapper is not signalled together with its children.
        expect(server.command.split("&&").at(-1)?.trim()).toMatch(/^exec /);
        expect(server.gracefulShutdown).toEqual({
          signal: "SIGTERM",
          timeout: expect.any(Number),
        });
      }
    },
  );
});
