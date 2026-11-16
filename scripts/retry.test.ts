import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const script = resolve(__dirname, "retry.sh");

describe("retry.sh", () => {
  let dir: string;
  let counter: string;

  // Fails until it has been called `failures` times, counting calls in a file.
  const flaky = (failures: number) => [
    "sh",
    "-c",
    `n=$(($(cat ${counter}) + 1)); echo $n > ${counter}; [ $n -gt ${failures} ]`,
  ];

  const run = (attempts: number, command: string[]) =>
    spawnSync("sh", [script, String(attempts), "0", ...command], {
      encoding: "utf8",
    });

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "retry-"));
    counter = join(dir, "count");
    writeFileSync(counter, "0");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("succeeds without a retry when the command passes", () => {
    const result = run(3, flaky(0));

    expect(result.status).toBe(0);
    expect(readFileSync(counter, "utf8").trim()).toBe("1");
  });

  it("retries a failing command until it succeeds", () => {
    const result = run(3, flaky(2));

    expect(result.status).toBe(0);
    expect(readFileSync(counter, "utf8").trim()).toBe("3");
  });

  it("fails after the last attempt and keeps the command's exit code", () => {
    writeFileSync(counter, "");

    const result = run(3, ["sh", "-c", `echo x >> ${counter}; exit 7`]);

    expect(result.status).toBe(7);
    expect(readFileSync(counter, "utf8").trim().split("\n")).toHaveLength(3);
  });
});
