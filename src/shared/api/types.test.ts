import { describe, expectTypeOf, it } from "vitest";

import type { ApiErrorBody } from "./types";

// Checked by `tsc` (`bun run typecheck`): fails if the backend error body
// changes shape after `bun run api:generate`.
describe("shared backend contract types", () => {
  it("describes the shared error body", () => {
    expectTypeOf<ApiErrorBody["status"]>().toEqualTypeOf<number>();
    expectTypeOf<ApiErrorBody["message"]>().toEqualTypeOf<string | string[]>();
    expectTypeOf<ApiErrorBody["timestamp"]>().toEqualTypeOf<string>();
    expectTypeOf<ApiErrorBody["path"]>().toEqualTypeOf<string>();
  });
});
