import { describe, expect, it } from "vitest";

import * as api from "./index";

describe("shared/api public interface", () => {
  it("exposes only the client building blocks and the error class", () => {
    expect(Object.keys(api).sort()).toEqual([
      "ApiError",
      "createApiClient",
      "unwrap",
    ]);
  });
});
