import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("labels the field", () => {
    render(<Input label="Your name" onChange={vi.fn()} value="" />);

    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
  });

  it("renders a single-line input by default", () => {
    render(<Input label="Your name" onChange={vi.fn()} value="" />);

    expect(screen.getByRole("textbox").tagName).toBe("INPUT");
  });

  it("renders a textarea when multiline", () => {
    render(<Input label="Message" multiline onChange={vi.fn()} value="" />);

    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  it("passes the typed text, not the event, to onChange", async () => {
    const onChange = vi.fn();

    render(<Input label="Your name" onChange={onChange} value="" />);
    await userEvent.type(screen.getByLabelText("Your name"), "A");

    expect(onChange).toHaveBeenCalledWith("A");
  });

  it("is valid and has no description without an error", () => {
    render(<Input label="Your name" onChange={vi.fn()} value="" />);

    const field = screen.getByLabelText("Your name");

    expect(field).not.toHaveAttribute("aria-invalid", "true");
    expect(field).not.toHaveAttribute("aria-describedby");
  });

  it("exposes the error to assistive technology", () => {
    render(
      <Input
        error="This field is required"
        label="Your name"
        onChange={vi.fn()}
        value=""
      />,
    );

    const field = screen.getByLabelText("Your name");

    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("This field is required");
  });

  it("marks a required field", () => {
    render(<Input label="Your name" onChange={vi.fn()} required value="" />);

    expect(screen.getByLabelText(/Your name/)).toBeRequired();
  });

  it("forwards the type and the autocomplete hint", () => {
    render(
      <Input
        autoComplete="email"
        label="Email"
        onChange={vi.fn()}
        type="email"
        value=""
      />,
    );

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocomplete",
      "email",
    );
  });

  it("highlights the border pink on hover and purple on focus", () => {
    render(<Input label="Your name" onChange={vi.fn()} value="" />);

    const field = screen.getByLabelText("Your name");

    expect(field).toHaveClass("hover:border-focus-ring");
    expect(field).toHaveClass("focus-visible:border-accent");
    expect(field).not.toHaveClass("hover:border-accent");
    expect(field).not.toHaveClass("focus-visible:border-focus-ring");
  });
});
