import type { ReactNode } from "react";

type ButtonContentProps = {
  children?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
};

export const ButtonContent = ({
  children,
  isLoading,
  loadingLabel = "Loading...",
}: ButtonContentProps) => {
  if (isLoading) {
    return <span className="pt-0.75">{loadingLabel}</span>;
  }

  return <span className="pt-0.75">{children}</span>;
};
