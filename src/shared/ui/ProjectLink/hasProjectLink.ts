export const hasProjectLink = (
  href: string | null | undefined,
): href is string => typeof href === "string" && href.trim() !== "";
