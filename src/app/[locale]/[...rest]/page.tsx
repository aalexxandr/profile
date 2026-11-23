import { notFound } from "next/navigation";

// Any address under a locale that matches no page: hand it to the localized
// `[locale]/not-found.tsx`, which keeps the site menu (an unmatched URL would
// otherwise get Next's default 404 without the layout).
export default function UnknownPage(): never {
  notFound();
}
