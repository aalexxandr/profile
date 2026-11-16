import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectLink } from "./ProjectLink";

const props = {
  ariaLabel: "Project link: Spectre",
  label: "Project link",
  privateLabel: "Private project",
};

describe("ProjectLink", () => {
  it("renders an external link when there is an href", () => {
    render(<ProjectLink {...props} href="https://example.com/spectre" />);

    const link = screen.getByRole("link", { name: props.ariaLabel });

    expect(link).toHaveAttribute("href", "https://example.com/spectre");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent(props.label);
    expect(screen.queryByText(props.privateLabel)).not.toBeInTheDocument();
  });

  it.each([null, undefined, "", "  "])(
    "renders the private project label without a link for %j",
    (href) => {
      render(<ProjectLink {...props} href={href} />);

      expect(screen.getByText(props.privateLabel)).toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.queryByText(props.label)).not.toBeInTheDocument();
    },
  );
});
