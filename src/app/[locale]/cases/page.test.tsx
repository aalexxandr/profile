import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";

import CasesRoute from "./page";

const { getCases } = vi.hoisted(() => ({ getCases: vi.fn() }));

vi.mock("@/views/cases", () => ({
  CasesPage: () => null,
  getCases,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("cases list route", () => {
  it.each(["ru", "en"] as const)(
    "loads the backend cases for %s",
    async (locale) => {
      getCases.mockResolvedValue([]);

      const element = await CasesRoute({
        params: Promise.resolve({ locale }),
      });

      expect(getCases).toHaveBeenCalledWith(locale);
      expect(element.props.caseItems).toEqual([]);
      expect(element.props.locale).toBe(locale);
    },
  );

  it("fails when the backend request fails", async () => {
    getCases.mockRejectedValue(new ApiError(500, "boom"));

    await expect(
      CasesRoute({ params: Promise.resolve({ locale: "ru" }) }),
    ).rejects.toThrow("boom");
  });
});
