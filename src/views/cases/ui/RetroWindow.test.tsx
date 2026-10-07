import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RetroWindow } from "./RetroWindow";

const controlLabels = {
  close: "Close window",
  fullScreen: "Full screen window",
  minimize: "Minimize window",
};

const renderWindow = () =>
  render(
    <RetroWindow
      controlLabels={controlLabels}
      objectsCount={7}
      objectsLabel="objects"
      title="Product UI"
    >
      <p>Window content</p>
    </RetroWindow>,
  );

const getContentWrapper = () =>
  screen.getByText("Window content").closest("[aria-hidden]");

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("RetroWindow", () => {
  it("is exposed as a named section", () => {
    renderWindow();

    expect(
      screen.getByRole("region", { name: "Product UI" }),
    ).toBeInTheDocument();
  });

  it("gives every control button an accessible name", () => {
    renderWindow();

    for (const label of Object.values(controlLabels)) {
      expect(screen.getByRole("button", { name: label })).toHaveAttribute(
        "type",
        "button",
      );
    }
  });

  it("shows the status label it is given", () => {
    renderWindow();

    expect(screen.getByText("7 objects")).toBeInTheDocument();
  });

  it("renders its children", () => {
    renderWindow();

    expect(screen.getByText("Window content")).toBeInTheDocument();
  });

  it("hides the content from assistive tech while collapsed", () => {
    renderWindow();

    expect(getContentWrapper()).toHaveAttribute("aria-hidden", "false");

    fireEvent.click(screen.getByRole("button", { name: "Minimize window" }));

    expect(getContentWrapper()).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the content again after the full screen button is pressed", () => {
    renderWindow();

    fireEvent.click(screen.getByRole("button", { name: "Minimize window" }));
    fireEvent.click(screen.getByRole("button", { name: "Full screen window" }));

    expect(getContentWrapper()).toHaveAttribute("aria-hidden", "false");
  });

  it("plays and then removes the close animation class", () => {
    renderWindow();
    const section = screen.getByRole("region", { name: "Product UI" });

    fireEvent.click(screen.getByRole("button", { name: "Close window" }));
    expect(section).toHaveClass("animate-retro-zoom");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(section).not.toHaveClass("animate-retro-zoom");
  });

  it("can be operated from the keyboard", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderWindow();

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Minimize window" }),
    ).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(getContentWrapper()).toHaveAttribute("aria-hidden", "true");
  });
});
