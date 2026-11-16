## Why

The backend made the case `projectLink` a nullable field (`null` in responses). A case without a link is a private project: one that has no public site, such as a closed administrative app for the employees of a single corporation, or work under an NDA. The frontend still treats `projectLink` as a required string and always renders an external link, so a case without a link would render a broken `<a>` with an empty or `undefined` `href` in the list block and in the "About case" section of the case page.

## What Changes

- Regenerate `src/shared/api/generated/schema.d.ts` (`pnpm api:generate`) so the `projectLink` of `CaseListItemDto` and `CaseDetailDto` is typed as `string | null` (nullable in responses), and make the stub fixtures and the static fallback (`src/shared/content/cases.ts`) able to describe a case without a link.
- Add one shared `ProjectLink` component in `shared/ui`: with a link it renders the existing `ExternalLink`; without one (absent, `null`, empty or whitespace-only) it renders a non-interactive "private project" label, a muted pixel-font text "Private project" (`ru`: "Закрытый проект"), with no anchor and no external-link icon.
- Use `ProjectLink` in `CaseBlock` (cases list) and `CaseAbout` (case page) instead of the direct `ExternalLink`, so the block keeps its layout and the section keeps its structure.
- Add the label text to the `Dictionary` type and to both `ru` and `en` dictionaries.
- Add a stub fixture case without a project link and Playwright coverage for it in both locales.
- Update `CLAUDE.md` where it describes the case data and the two link usages.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cases-catalog`: the case block links to the project site only when the case has a link, and shows a "private project" label otherwise.
- `case-details`: the "About case" section shows the project link only when the case has one, and a "private project" label otherwise.
- `backend-api-contract`: the generated types describe `projectLink` as nullable.

## Impact

- `src/shared/api/generated/schema.d.ts` (generated; needs a reachable backend with the nullable field), `scripts/stub-api/fixtures.ts`, `src/shared/content/cases.ts`.
- New `src/shared/ui/ProjectLink` (component + test), `src/views/cases/ui/CaseBlock.tsx`, `src/views/case-details/ui/CaseAbout.tsx` and their tests, `src/shared/i18n/types.ts`, `src/shared/i18n-server/dictionaries/{ru,en}.ts`, `e2e/`, `CLAUDE.md`.
- No new dependencies, no routing or metadata change.

## Out of Scope

- Hiding the link row entirely (the "private project" label is shown instead, by decision, see design.md).
- Changing any other nullable field (`image`, `backgroundImage`) or its fallbacks.
- Admin operations for setting or clearing the link; the client stays read-only.
- Adding `api:check` to CI.
