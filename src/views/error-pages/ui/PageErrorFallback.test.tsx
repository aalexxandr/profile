import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";
import type { Dictionary, Locale } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { PageErrorFallback } from "./PageErrorFallback";

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each<[Locale, Dictionary]>([
  ["ru", ru],
  ["en", en],
])("PageErrorFallback in %s", (locale, dictionary) => {
  const texts = dictionary.errors.serverError;
  const error = new ApiError(500, "Internal server error");

  const renderFallback = (retry = vi.fn()) => {
    render(
      <PageErrorFallback
        error={error}
        locale={locale}
        retry={retry}
        texts={texts}
      />,
    );

    return retry;
  };

  it("shows the localized title and description", () => {
    renderFallback();

    expect(
      screen.getByRole("heading", { level: 1, name: texts.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(texts.description)).toBeInTheDocument();
  });

  it("retries the page on click", async () => {
    const retry = renderFallback();

    await userEvent.click(screen.getByRole("button", { name: texts.retry }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("retries the page from the keyboard", async () => {
    const retry = renderFallback();

    screen.getByRole("button", { name: texts.retry }).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    expect(retry).toHaveBeenCalledTimes(2);
  });

  it("links back to the home page of its locale", () => {
    renderFallback();

    expect(screen.getByRole("link", { name: texts.home })).toHaveAttribute(
      "href",
      `/${locale}`,
    );
  });

  it("keeps the error details out of the page and logs them to the console", () => {
    renderFallback();

    expect(screen.queryByText(/Internal server error/)).not.toBeInTheDocument();
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});
