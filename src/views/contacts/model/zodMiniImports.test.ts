import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SRC_DIR = join(__dirname, "..", "..", "..");

const collectSources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectSources(path);
    }

    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });

describe("zod imports", () => {
  // Classic `zod` brings a much larger runtime into the client bundle than
  // `zod/mini` (see the `use-react-hook-form-in-contacts` design).
  it("only come from zod/mini", () => {
    const offenders = collectSources(SRC_DIR).filter(
      (file) =>
        !file.endsWith("zodMiniImports.test.ts") &&
        /from\s+["']zod["']/.test(readFileSync(file, "utf8")),
    );

    expect(offenders.map((file) => file.replace(SRC_DIR, "src"))).toEqual([]);
  });
});
