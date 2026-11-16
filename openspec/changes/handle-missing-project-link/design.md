# Design

## Context

`projectLink` is read in two places: `src/views/cases/ui/CaseBlock.tsx` (list) and `src/views/case-details/ui/CaseAbout.tsx` (case page), both rendering `ExternalLink` (`shared/ui`) with `aria-label` built from the dictionary label and the case name. The two views are independent slices, so neither may import from the other (see `CLAUDE.md`, move shared things down to `shared`). The regenerated `schema.d.ts` types the response `projectLink` as `string | null` (the key is always present); only the admin create/update DTOs omit it. The static fallback and stub fixtures are typed from `Schemas`, so they follow the regenerated types.

## Goals / Non-Goals

**Goals:**

- A case without a link never renders an anchor with a missing `href`.
- Same behavior in the list and on the case page, in both locales, with one implementation.
- The label keeps the existing layout (the list block has fixed heights) and the pixel/retro look.

**Non-Goals:**

- Any change to how a present link looks or behaves.
- Validating that a present link is a well-formed URL (the backend guarantees http/https).

## Decisions

- **Shared `ProjectLink` in `shared/ui`** (folder with the component and its test) taking `href` (`string | null | undefined`), the visible `label`, the accessible `ariaLabel`, the `privateLabel` and an optional `className`. With a usable `href` it renders `ExternalLink`; otherwise a `<span>` with the label text. Alternative: a conditional in each of `CaseBlock` and `CaseAbout`; rejected, it duplicates the rule across two slices and puts a business rule into component JSX, which the conventions forbid.
- **"Has a link" is decided by a small helper next to the component in `shared/ui/ProjectLink`** (`hasProjectLink`): non-null, string, non-empty after `trim()`. This covers an omitted key, `null` and an empty string, whichever form the backend uses, without waiting for the contract answer.
- **A "private project" label is visible text, not a hidden row.** A missing link means the project is closed (for example an internal admin app of one company), so the text states that instead of implying an error or a temporary outage ("unavailable" was rejected for that reason; "Internal use only" and "Restricted access" were rejected as narrower or vaguer, since a project may be closed for an NDA and not only for internal use). Hiding the row would leave the list block and the About section looking unfinished and would shift the heights; a muted `font-vcr` uppercase text (same type scale as `ExternalLink`, `text-white/50`, no underline, no icon, not focusable) reads as an intentional state. Alternatives: a disabled-looking link (`aria-disabled`), rejected because it is a fake control that keyboard and screen-reader users still meet; removing the row, rejected as above.
- **Accessibility.** The label is plain text in the reading order, so it needs no extra role. It is not an `<a>` and not in the tab order. The existing link keeps `aria-label` "Project link: <case name>".
- **Dictionary key** `pages.cases.actions.projectPrivate` next to `projectLink`; added to the `Dictionary` type and to both dictionaries (en: "Private project", ru: "Закрытый проект"). No lock icon: it would be an extra asset and the text already says it.
- **Types.** Run `pnpm api:generate`; the nullable field makes `CaseBlock`/`CaseAbout` and the fixtures fail typecheck until handled, which is the intended guard. If the backend is unreachable, edit nothing by hand in `generated/`; report the blocker.
- **Test data.** Add a third-kind fixture case without `projectLink` to `scripts/stub-api/fixtures.ts` (E2E and CI use the stub) and keep the static fallback able to omit the field; do not remove the link from the existing real fallback case.

## Risks / Trade-offs

- [A response could still omit the key or send an empty string] → the helper treats `null`, `undefined`, empty and whitespace the same.
- [The same label is shown for every case without a link, even if the real reason differs] → acceptable, since the backend carries no reason; the text is one dictionary key per locale, trivial to change.
- [Adding a stub case changes list-based E2E assertions (counts, order)] → put the new case last and update only the affected assertions.
