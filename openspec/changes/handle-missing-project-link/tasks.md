# Tasks

## 1. Contract and fixtures

- [x] 1.1 Run `pnpm api:generate` against the backend and verify `projectLink` is `string | null` on `CaseListItemDto` and `CaseDetailDto` in `schema.d.ts` (if the backend is unreachable, report it as a blocker and do not hand-edit `generated/`)
- [x] 1.2 Add type assertions to `src/views/cases/api/types.test.ts` and `src/views/case-details/api/types.test.ts` that `projectLink` may be missing (red first), and verify they pass after 1.1
- [x] 1.3 Make `src/shared/content/cases.ts` and `scripts/stub-api/fixtures.ts` able to describe a case without a link, add one stub case without `projectLink` (last in the list) and update `scripts/stub-api/handler.test.ts` and `src/shared/content/cases.test.ts` (if present); verify `pnpm typecheck` and `pnpm test` pass

## 2. Private project label

- [x] 2.1 Add the key `pages.cases.actions.projectPrivate` to `Dictionary` and to both `ru` and `en` dictionaries; verify `pnpm typecheck`
- [x] 2.2 Write failing tests for `hasProjectLink` (`undefined`, `null`, `""`, `"  "`, valid URL) and for `ProjectLink` (anchor with `href`, `target="_blank"`, `rel` and `aria-label` when linked; label text, no `<a>` and no `link` role when not), then implement `src/shared/ui/ProjectLink` (component, `hasProjectLink.ts`) and export it from `shared/ui`; verify the new tests pass
- [x] 2.3 Verify `pnpm lint` shows no `react/no-multi-comp` or import-alias warnings for the new files

## 3. Use it in the slices

- [x] 3.1 Add failing tests to `CaseBlock.test.tsx` for a case without a link in `ru` and `en` ("Private project" / "Закрытый проект" label shown, no project link, case page link still present), then switch `CaseBlock.tsx` to `ProjectLink`; verify the tests pass, including the existing linked case
- [x] 3.2 Add failing tests to `CaseAbout.test.tsx` (and a case-page level check in `CaseDetailPage.test.tsx`) for a case without a link in both locales, then switch `CaseAbout.tsx` to `ProjectLink`; verify the tests pass
- [ ] 3.3 Add Playwright E2E for the stub case without a link: on `/ru/cases` and `/en/cases` the block shows the "Private project" / "Закрытый проект" label and no project link, and on its case page the "About case" section does the same, with no console errors; verify with `pnpm test:e2e`

## 4. UI check and docs

- [ ] 4.1 Use the `ui-ux-pro-max` skill before styling the label; verify the muted text keeps the contrast and type scale of its surroundings
- [ ] 4.2 Check the label with the Playwright MCP on desktop and mobile viewports on `/en/cases` and a case page without a link: no clipped or overlapping text, the list block heights unchanged, no console errors
- [x] 4.3 Update `CLAUDE.md` (case data, the shared `ProjectLink`, the nullable link) and `README.md` if it describes these; verify the text matches the code
- [ ] 4.4 Run `pnpm check` and `pnpm fsd:check` and verify both pass (an `EMFILE` failure of `fsd:check` is reported as an environment blocker, not a pass)
