import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Lamp } from "./Lamp";

describe("Lamp", () => {
  it("is a keyboard-reachable button that toggles the light", () => {
    render(<Lamp ariaLabel="Лампа" />);

    const lamp = screen.getByRole("button", { name: "Лампа" });

    expect(lamp).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(lamp);
    expect(lamp).toHaveAttribute("aria-pressed", "true");
  });
});
