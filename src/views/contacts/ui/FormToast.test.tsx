import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TOAST_EXIT_TIME_MS } from "../config";

import { FormToast } from "./FormToast";

const props = { text: "Thank you!", title: "Message sent" };

describe("FormToast", () => {
  it("keeps an empty live region before anything is sent", () => {
    render(<FormToast {...props} isVisible={false} />);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("shows the title and the text in the live region", () => {
    render(<FormToast {...props} isVisible />);

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("Message sent");
    expect(status).toHaveTextContent("Thank you!");
  });

  it("is a fixed layer in the bottom corner, away from the site menu", () => {
    render(<FormToast {...props} isVisible />);

    const status = screen.getByRole("status");

    expect(status).toHaveClass("fixed");
    expect(status.className).toMatch(/\bbottom-\d/);
    expect(status.className).not.toMatch(/\btop-\d/);
    expect(status).toHaveClass("pointer-events-none");
  });

  it("is rendered outside the form so it never moves it", () => {
    const { container } = render(<FormToast {...props} isVisible />);

    expect(container).not.toContainElement(screen.getByRole("status"));
  });

  it("has no close button", () => {
    render(<FormToast {...props} isVisible />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  describe("leaving", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("fades out first and is removed after the exit time", () => {
      const { rerender } = render(<FormToast {...props} isVisible />);

      rerender(<FormToast {...props} isVisible={false} />);

      const notice = screen.getByText("Message sent").closest("div");

      expect(notice).toHaveClass("animate-reveal-out");
      expect(screen.getByRole("status")).toHaveTextContent("Thank you!");

      act(() => {
        vi.advanceTimersByTime(TOAST_EXIT_TIME_MS - 1);
      });
      expect(screen.getByRole("status")).toHaveTextContent("Message sent");

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
    });

    it("comes back with the entrance animation if shown again while leaving", () => {
      const { rerender } = render(<FormToast {...props} isVisible />);

      rerender(<FormToast {...props} isVisible={false} />);
      act(() => {
        vi.advanceTimersByTime(TOAST_EXIT_TIME_MS / 2);
      });
      rerender(<FormToast {...props} isVisible />);
      act(() => {
        vi.advanceTimersByTime(TOAST_EXIT_TIME_MS);
      });

      const notice = screen.getByText("Message sent").closest("div");

      expect(notice).toHaveClass("animate-reveal-up");
      expect(notice).not.toHaveClass("animate-reveal-out");
    });
  });
});
