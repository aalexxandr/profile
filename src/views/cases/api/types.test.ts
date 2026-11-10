import { describe, expectTypeOf, it } from "vitest";

import type { CaseListItem } from "./types";

// These assertions are checked by `tsc` (`pnpm typecheck`): if the backend
// contract changes shape after `pnpm api:generate`, typecheck fails here.
describe("case list contract types", () => {
  it("allows null for the picture fields", () => {
    expectTypeOf<CaseListItem["image"]>().toEqualTypeOf<string | null>();
    expectTypeOf<CaseListItem["blurImage"]>().toEqualTypeOf<string | null>();
  });

  it("does not carry the background fields", () => {
    expectTypeOf<CaseListItem>().not.toHaveProperty("backgroundImage");
    expectTypeOf<CaseListItem>().not.toHaveProperty("backgroundBlurImage");
  });

  it("accepts only the supported locales", () => {
    expectTypeOf<CaseListItem["locale"]>().toEqualTypeOf<"ru" | "en">();
  });
});
