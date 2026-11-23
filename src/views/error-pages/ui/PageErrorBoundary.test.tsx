import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";
import { en } from "@/shared/i18n-server/dictionaries/en";

import { PageErrorBoundary } from "./PageErrorBoundary";

const Thrower = ({ error }: { error: Error }): never => {
  throw error;
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PageErrorBoundary", () => {
  it.each([
    ["a backend server error", new ApiError(500, "Internal server error")],
    ["a network failure", new TypeError("fetch failed")],
  ])("shows the error screen for %s and keeps the menu", (_name, error) => {
    render(
      <>
        <nav aria-label="Main navigation" />
        <PageErrorBoundary locale="en" texts={en.errors.serverError}>
          <Thrower error={error} />
        </PageErrorBoundary>
      </>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: en.errors.serverError.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(error.message)).not.toBeInTheDocument();
  });

  it("renders the page when nothing throws", () => {
    render(
      <PageErrorBoundary locale="en" texts={en.errors.serverError}>
        <p>page</p>
      </PageErrorBoundary>,
    );

    expect(screen.getByText("page")).toBeInTheDocument();
  });
});
