import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "./robots";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots", () => {
  it("allows crawling everything for all user agents", () => {
    expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
  });

  it("builds the sitemap url from the site url", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(robots().sitemap).toBe("https://example.com/sitemap.xml");
  });
});
