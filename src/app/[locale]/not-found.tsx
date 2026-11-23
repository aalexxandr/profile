import { getNotFoundTexts, NotFoundPage } from "@/views/error-pages";

// Rendered inside the locale layout for `notFound()`, unknown case slugs and
// every address the catch-all `[...rest]` route receives.
export default async function NotFound() {
  return <NotFoundPage textsByLocale={await getNotFoundTexts()} />;
}
