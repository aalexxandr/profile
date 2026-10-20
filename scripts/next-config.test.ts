import { describe, expect, it } from "vitest";

import nextConfig from "../next.config";

const storageHost = "437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz";

describe("next config", () => {
  it("allows images from the case storage host over https", () => {
    const patterns = nextConfig.images?.remotePatterns ?? [];

    expect(
      patterns.some((pattern) => {
        const { hostname, protocol } =
          pattern instanceof URL
            ? { hostname: pattern.hostname, protocol: pattern.protocol }
            : { hostname: pattern.hostname, protocol: `${pattern.protocol}:` };

        return hostname === storageHost && protocol === "https:";
      }),
    ).toBe(true);
  });
});
