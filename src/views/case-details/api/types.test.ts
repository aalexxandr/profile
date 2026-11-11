import { describe, expectTypeOf, it } from "vitest";

import type { CaseDetail } from "./types";

// These assertions are checked by `tsc` (`pnpm typecheck`): if the backend
// contract changes shape after `pnpm api:generate`, typecheck fails here.
describe("case detail contract types", () => {
  it("allows null for the picture and optional fact fields", () => {
    expectTypeOf<CaseDetail["image"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseDetail["blurImage"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseDetail["backgroundImage"]>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<CaseDetail["backgroundBlurImage"]>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<CaseDetail["company"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseDetail["teamSize"]>().toEqualTypeOf<number | null>();
    expectTypeOf<CaseDetail["endedAt"]>().toEqualTypeOf<string | null>();
  });

  it("accepts only the declared roles", () => {
    expectTypeOf<CaseDetail["role"]>().toEqualTypeOf<
      "FRONTEND" | "FULLSTACK"
    >();
  });
});
