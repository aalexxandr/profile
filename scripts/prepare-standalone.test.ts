import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { prepareStandalone } from "./prepare-standalone";

const write = (path: string, content: string) => {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
};

describe("prepareStandalone", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "standalone-"));
    write(join(root, "public", "logo.png"), "logo");
    write(join(root, ".next", "static", "chunk.js"), "chunk");
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("fails clearly when the app was not built", () => {
    expect(() => prepareStandalone(root)).toThrow(/pnpm build/);
  });

  it("copies public and static assets next to the standalone server", () => {
    write(join(root, ".next", "standalone", "server.js"), "server");

    prepareStandalone(root);

    expect(
      readFileSync(join(root, ".next/standalone/public/logo.png"), "utf8"),
    ).toBe("logo");
    expect(
      readFileSync(
        join(root, ".next/standalone/.next/static/chunk.js"),
        "utf8",
      ),
    ).toBe("chunk");
  });

  it("replaces stale copies instead of keeping old assets", () => {
    write(join(root, ".next", "standalone", "server.js"), "server");
    write(join(root, ".next/standalone/public/old.png"), "old");

    prepareStandalone(root);

    expect(existsSync(join(root, ".next/standalone/public/old.png"))).toBe(
      false,
    );
    expect(existsSync(join(root, ".next/standalone/public/logo.png"))).toBe(
      true,
    );
  });
});
