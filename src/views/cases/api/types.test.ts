import { describe, expectTypeOf, it } from "vitest";

import type { CaseDetail, CaseListItem } from "./types";

// These assertions are checked by `tsc` (`bun run typecheck`): if the backend
// contract changes shape after `bun run api:generate`, typecheck fails here.
describe("case contract types", () => {
  it("allows null for the picture fields", () => {
    expectTypeOf<CaseListItem["image"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseListItem["blurImage"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseDetail["image"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseDetail["blurImage"]>().toEqualTypeOf<string | null>();
  });

  it("accepts only the declared roles", () => {
    expectTypeOf<CaseDetail["role"]>().toEqualTypeOf<
      "FRONTEND" | "FULLSTACK"
    >();
  });

  it("accepts only the supported locales", () => {
    expectTypeOf<CaseListItem["locale"]>().toEqualTypeOf<"ru" | "en">();
  });
});
