import { spawn } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");
const STOP_LIMIT_MS = 5_000;

const waitForOutput = (
  child: ReturnType<typeof spawn>,
  text: string,
): Promise<void> =>
  new Promise((resolveOutput, reject) => {
    child.stdout?.on("data", (chunk: Buffer) => {
      if (chunk.toString().includes(text)) {
        resolveOutput();
      }
    });
    child.on("error", reject);
  });

describe("stub API server process", () => {
  it("exits on SIGTERM, so a test runner can stop it", async () => {
    // Launched the way playwright.config.ts launches it.
    const child = spawn(
      "node_modules/.bin/tsx",
      ["scripts/stub-api/server.ts"],
      {
        cwd: root,
        env: { ...process.env, API_URL: "http://localhost:3199" },
      },
    );
    const exited = new Promise<void>((resolveExit) => {
      child.on("exit", () => resolveExit());
    });

    try {
      await waitForOutput(child, "listening");
      child.kill("SIGTERM");

      const outcome = await Promise.race([
        exited.then(() => "exited"),
        new Promise((resolveTimeout) =>
          setTimeout(() => resolveTimeout("still running"), STOP_LIMIT_MS),
        ),
      ]);

      expect(outcome).toBe("exited");
    } finally {
      child.kill("SIGKILL");
    }
  }, 15_000);
});
