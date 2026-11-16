import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const config = readFileSync(
  resolve(__dirname, "../.github/dependabot.yml"),
  "utf8",
);

// The text of the update entry of one package ecosystem.
const entryOf = (ecosystem: string) => {
  const entries = config.split(/\n(?=  - package-ecosystem:)/);
  const entry = entries.find((candidate) =>
    candidate.includes(`package-ecosystem: ${ecosystem}`),
  );

  expect(entry, `no "${ecosystem}" entry in dependabot.yml`).toBeDefined();

  return entry ?? "";
};

describe("Dependabot config", () => {
  it("updates react and react-dom together", () => {
    const groups = /groups:[\s\S]*$/.exec(entryOf("npm"))?.[0] ?? "";

    expect(groups).toMatch(/patterns:[\s\S]*?- ["']?react["']?\s/);
    expect(groups).toMatch(/patterns:[\s\S]*?- ["']?react-dom["']?\s/);
  });

  it.each(["eslint", "typescript"])(
    "does not propose a new major version of %s",
    (name) => {
      const rule = new RegExp(
        `- dependency-name: ["']?${name}["']?\\s+update-types:\\s*(?:\\[\\s*)?(?:-\\s*)?["']?version-update:semver-major["']?\\s*(?:\\]|\\n|$)`,
      );

      expect(entryOf("npm")).toMatch(rule);
    },
  );

  it("explains why majors are ignored", () => {
    expect(entryOf("npm")).toMatch(
      /#.*(eslint-plugin-react|typescript-eslint)/,
    );
  });
});
