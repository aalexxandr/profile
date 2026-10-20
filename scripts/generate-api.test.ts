import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { OpenAPI3 } from "openapi-typescript";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { generateApiTypes } from "./generate-api";

const document: OpenAPI3 = {
  openapi: "3.0.0",
  info: { title: "Test API", version: "1" },
  paths: {},
  components: {
    schemas: {
      Picture: {
        type: "object",
        properties: { image: { type: "string", nullable: true } },
        required: ["image"],
      },
    },
  },
};

const UNREACHABLE = new URL("http://localhost:9/docs-json");
const PREVIOUS_TYPES = "export type Previous = string;\n";

let directory: string;
let outFile: string;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "generate-api-"));
  outFile = join(directory, "schema.d.ts");
  await writeFile(outFile, PREVIOUS_TYPES);
});

afterEach(() => rm(directory, { recursive: true, force: true }));

describe("generateApiTypes", () => {
  it("writes types for the document and keeps nullable fields nullable", async () => {
    await generateApiTypes(document, outFile);

    const types = await readFile(outFile, "utf8");
    expect(types).toContain("auto-generated");
    expect(types).toContain("image: string | null;");
  });

  it("produces identical output on a repeated run", async () => {
    await generateApiTypes(document, outFile);
    const first = await readFile(outFile, "utf8");

    await generateApiTypes(document, outFile);

    expect(await readFile(outFile, "utf8")).toBe(first);
  });

  it.each([
    ["an unreachable backend", UNREACHABLE],
    ["a document that is not OpenAPI", '{"hello": "world"}'],
  ])("keeps the previous types file for %s", async (_name, source) => {
    await expect(generateApiTypes(source, outFile)).rejects.toThrow();

    expect(await readFile(outFile, "utf8")).toBe(PREVIOUS_TYPES);
  });
});
