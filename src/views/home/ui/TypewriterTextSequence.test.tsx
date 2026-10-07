import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TypewriterTextSequence } from "./TypewriterTextSequence";

vi.mock("react-simple-typewriter", () => ({
  Typewriter: ({ words }: { words: string[] }) => (
    <span data-testid="typewriter">{words.join("|")}</span>
  ),
}));

const texts = ["First line", "Second line"];

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TypewriterTextSequence", () => {
  it("renders nothing when there are no texts", () => {
    const { container } = render(<TypewriterTextSequence texts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("always exposes the full text to screen readers", () => {
    render(<TypewriterTextSequence texts={texts} startDelay={500} />);

    expect(screen.getByText("First line Second line")).toHaveClass("sr-only");
  });

  it("hides the animated text from assistive tech", () => {
    render(<TypewriterTextSequence texts={texts} />);

    expect(screen.getByTestId("typewriter").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("starts typing immediately without a start delay", () => {
    render(<TypewriterTextSequence texts={texts} />);

    expect(screen.getByTestId("typewriter")).toHaveTextContent(
      "First line|Second line",
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it("starts typing only after the start delay", () => {
    render(<TypewriterTextSequence texts={texts} startDelay={500} />);

    expect(screen.queryByTestId("typewriter")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(screen.queryByTestId("typewriter")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("typewriter")).toBeInTheDocument();
  });

  it("clears the start timer on unmount", () => {
    const { unmount } = render(
      <TypewriterTextSequence texts={texts} startDelay={500} />,
    );

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
