import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("has the label as its accessible name", () => {
    render(<Checkbox checked={false} label="Telegram" onChange={vi.fn()} />);

    expect(screen.getByRole("checkbox", { name: "Telegram" })).toBeVisible();
  });

  it("reflects the checked state", () => {
    const { rerender } = render(
      <Checkbox checked={false} label="Telegram" onChange={vi.fn()} />,
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(<Checkbox checked label="Telegram" onChange={vi.fn()} />);

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange when the label is clicked", async () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} label="Telegram" onChange={onChange} />);
    await userEvent.click(screen.getByText("Telegram"));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("toggles with the Space key", async () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} label="Telegram" onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard(" ");

    expect(screen.getByRole("checkbox")).toHaveFocus();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  describe("as a radio", () => {
    const renderGroup = (onChange = vi.fn(), selected = "email") =>
      render(
        <>
          <Checkbox
            checked={selected === "telegram"}
            label="Telegram"
            name="method"
            onChange={() => onChange("telegram")}
            type="radio"
          />
          <Checkbox
            checked={selected === "email"}
            label="Email"
            name="method"
            onChange={() => onChange("email")}
            type="radio"
          />
        </>,
      );

    it("renders native radios with the labels as names", () => {
      renderGroup();

      expect(screen.getByRole("radio", { name: "Telegram" })).not.toBeChecked();
      expect(screen.getByRole("radio", { name: "Email" })).toBeChecked();
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("selects another option on click", async () => {
      const onChange = vi.fn();

      renderGroup(onChange);
      await userEvent.click(screen.getByText("Telegram"));

      expect(onChange).toHaveBeenCalledWith("telegram");
    });

    it("does not report a click on the selected option", async () => {
      const onChange = vi.fn();

      renderGroup(onChange);
      await userEvent.click(screen.getByText("Email"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("moves the selection with the arrow keys", async () => {
      const onChange = vi.fn();

      renderGroup(onChange);
      await userEvent.tab();
      await userEvent.keyboard("{ArrowUp}");

      expect(onChange).toHaveBeenCalledWith("telegram");
    });
  });
});
