import { describe, expect, it } from "vitest";

import type { Schemas } from "@/shared/api/types";
import { caseSlugs } from "./fixtures";
import { handleRequest } from "./handler";

const get = (path: string) =>
  handleRequest(new Request(`http://localhost:3000${path}`));

describe("stub API", () => {
  it("lists the cases in the requested language", async () => {
    const response = await get("/cases?lang=en");
    const list: Schemas["CaseListItemDto"][] = await response.json();

    expect(response.status).toBe(200);
    expect(list.map(({ slug }) => slug)).toEqual(caseSlugs);
    expect(list.every(({ locale }) => locale === "en")).toBe(true);
  });

  it("falls back to Russian when lang is missing or unsupported", async () => {
    for (const path of ["/cases", "/cases?lang=de"]) {
      const list: Schemas["CaseListItemDto"][] = await (await get(path)).json();

      expect(list.every(({ locale }) => locale === "ru")).toBe(true);
    }
  });

  it("returns the case detail for a slug", async () => {
    const [slug] = caseSlugs;
    const response = await get(`/cases/${slug}?lang=ru`);
    const detail: Schemas["CaseDetailDto"] = await response.json();

    expect(response.status).toBe(200);
    expect(detail).toMatchObject({ slug, locale: "ru" });
    expect(detail.achievements.length).toBeGreaterThan(0);
  });

  it("answers an unknown slug with 404 and the contract error body", async () => {
    const response = await get("/cases/no-such-case?lang=en");
    const body: Schemas["ErrorResponseDto"] = await response.json();

    expect(response.status).toBe(404);
    expect(body).toMatchObject({
      status: 404,
      path: "/cases/no-such-case",
    });
    expect(typeof body.message).toBe("string");
    expect(typeof body.timestamp).toBe("string");
  });

  it("answers other paths with 404", async () => {
    expect((await get("/unknown")).status).toBe(404);
  });

  it("covers the edge cases the pages must handle", async () => {
    const details: Schemas["CaseDetailDto"][] = await Promise.all(
      caseSlugs.map(async (slug) =>
        (await get(`/cases/${slug}?lang=en`)).json(),
      ),
    );

    expect(details.some(({ image }) => image === null)).toBe(true);
    expect(details.some(({ image }) => image !== null)).toBe(true);
    expect(details.some(({ blurImage }) => blurImage === null)).toBe(true);
    expect(details.some(({ company }) => company === null)).toBe(true);
    expect(details.some(({ teamSize }) => teamSize === null)).toBe(true);
    expect(details.some(({ endedAt }) => endedAt === null)).toBe(true);
    expect(new Set(details.map(({ role }) => role))).toEqual(
      new Set(["FRONTEND", "FULLSTACK"]),
    );
  });
});
