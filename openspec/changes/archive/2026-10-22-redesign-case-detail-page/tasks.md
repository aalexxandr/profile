# Tasks

## 1. Assets and dictionary

- [x] 1.1 Copy `code-border.png` from `carbontec-site/apps/front/public/` to `public/code-border.png`; verify `file public/code-border.png` reports a 166 x 168 PNG
- [x] 1.2 Add `aboutTitle`, `challengesTitle` and `stackTitle` to the `Dictionary` type and to both `ru` and `en`, and remove `achievementsTitle`, `categoryLabel` and `stackLabel` (their only users are in `CaseDetailPage`, which tasks 2-5 rewrite); verify `bun run typecheck` fails only inside `CaseDetailPage` until group 5 lands, and that the dictionary tests still pass

## 2. Header

- [x] 2.1 Red: write `CaseHeader.test.tsx` for both locales covering the localized back link to `/{locale}/cases`, the category, the name as the single `h1`, the facts line with all `null` rules (company, team size, open `endedAt` reads "present"), the background `img` with the blur placeholder, the background without blur, and `backgroundImage: null` rendering no `img` and no "no image" text; verify the test fails for the right reason
- [x] 2.2 Green: implement `CaseHeader` in `views/case-details/ui/` (`next/image` with `fill` under a dark gradient, a facts `dl`, a back link in the `ExternalLink` style); verify `CaseHeader.test.tsx` passes

## 3. About case and picture preview

- [x] 3.1 Red: write tests for `CaseAbout` (localized title, description, project link with `target="_blank"`, `rel="noopener noreferrer"` and an accessible name containing the case name, no other content) and `CasePreview` (picture with the case name as alt and optional blur, "no image" text and no `img` when `image` is `null`); verify they fail
- [x] 3.2 Green: implement `CaseAbout` (reusing `ExternalLink`) and `CasePreview` (reusing `ImageWithFallback`); verify the tests pass

## 4. Stack and challenges

- [x] 4.1 Red: write tests for `CaseStack` (localized title, one list item per technology in backend order, the framed card carries the `code-border.png` border image) and `CaseChallenges` (metric, title and description of every achievement; no section and no title for an empty list); verify they fail
- [x] 4.2 Green: implement `CaseStack` (white card, `[border-image:url('/code-border.png')_25]`, decorative `/` prefix, narrower border below `sm`) and `CaseChallenges`; verify the tests pass

## 5. Page composition

- [x] 5.1 Red: rewrite `CaseDetailPage.test.tsx` for the new structure in `ru` and `en` (header, About case, preview, stack, challenges in order; one `h1`; no `RetroWindow` control buttons; the existing facts and `null` scenarios still hold); verify it fails
- [x] 5.2 Green: rewrite `CaseDetailPage` as a composition of the five components inside one scroll container, with no `RetroWindow`; verify `bun run test` passes for the `case-details` slice and `bun run typecheck` passes
- [x] 5.3 Update `e2e/cases.spec.ts` for the new page in both locales (back link, facts without the old `dt` counts, the stack items, challenges, the project link, the orbit case with `image: null` and `backgroundImage: null`); verify `bun run test:e2e` passes

## 6. UI check and docs

- [x] 6.1 Use the `ui-ux-pro-max` skill for the visual pass, then check the case page through the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px) for `spectre` (with background) and `orbit` (no images): no clipped or overlapping text, readable title over the background, no horizontal scroll, focus/hover/active states of the back and project links, no console errors; tune header heights and gradients as needed
- [x] 6.2 Update `CLAUDE.md` and `README.md` only where they describe the `case-details` page structure or `RetroWindow` usage; verify with grep that neither still mentions the old layout

## 7. Final checks

- [x] 7.1 Run `bun run check` (lint, format:check, typecheck, test, build) and verify it passes
- [x] 7.2 Run `bun run fsd:check`; verify it passes, or report an `EMFILE` failure as an environment blocker
- [x] 7.3 Run `openspec validate redesign-case-detail-page` and verify it reports the change as valid

## 8. Revision: calmer colours, inline stack, no case picture

This group supersedes the `CasePreview` parts of tasks 3.x and 5.x and the picture wording of 6.1; those tasks stay checked as history.

- [x] 8.1 Red: update `CaseDetailPage.test.tsx` so that a case with `image` and `blurImage` set renders no `img` for the case picture (only the header background may render an `img`) and no "no image" text appears for a case without images, in `ru` and `en`; update `e2e/cases.spec.ts` the same way (the orbit case page no longer shows "No image" / "Нет картинки"; the list still shows it once); verify the tests fail for the right reason
- [x] 8.2 Green: remove `CasePreview` and `CasePreview.test.tsx`, drop it from `CaseDetailPage`, and remove the `sizes` and `fallbackClassName` additions from `ImageWithFallback` together with their three tests (they have no other consumer; the list keeps working unchanged); verify `bun run test` and `bun run typecheck` pass
- [x] 8.3 Colours: keep the accent colour only on the back link and the project link (with their hover, focus and active states); make the "About case", "Stack" and "Challenges" titles white, the category and the fact labels muted (`text-white/60`) and the achievement metric white; verify with grep that `text-accent` remains only in those two links within `views/case-details/ui/`
- [x] 8.4 Stack row: render the technologies as a wrapping row inside the same `code-border.png` frame with the `/` marker kept per item; verify `CaseStack.test.tsx` still passes (order, frame) and the card is visibly shorter in the Playwright pass of 8.6
- [x] 8.5 Update `CLAUDE.md` so it no longer lists `CasePreview` and says the case page does not show `image`; verify with grep that `CasePreview` appears nowhere in the repo outside `openspec/changes`
- [x] 8.6 Re-check the case page through the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px) for `spectre` and `orbit`: only the two links are purple, titles are white, the stack card is a short row block, no empty gap where the picture was, no horizontal scroll, no console errors besides the stub's unreachable image host; then run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass

## 9. Revision: dates, stack frame, achievements

- [x] 9.1 Red: in `CaseHeader.test.tsx` (and the e2e facts check) assert the period with explicit strings instead of the test's own `Intl` helper: ru "март 2023 – июнь 2024" and "март 2023 – по настоящее время", en "March 2023 – June 2024" and "March 2023 – present"; verify the ru tests fail on the "г." suffix
- [x] 9.2 Green: change `formatMonth` in `CaseHeader` to join only the month and year parts of `Intl.DateTimeFormat.formatToParts`; verify `CaseHeader.test.tsx` passes and the helper in the test file is gone
- [x] 9.3 Red: rename the tests of `CaseChallenges` to `CaseAchievements.test.tsx` and assert the title "Achievements" / "Достижения", the order title, description, result inside each item (via `compareDocumentPosition`), the section omitted for an empty list; update `CaseDetailPage.test.tsx` and `e2e/cases.spec.ts` labels; verify they fail
- [x] 9.4 Green: rename `CaseChallenges` to `CaseAchievements`, replace the dictionary key `challengesTitle` with `achievementsTitle` ("Achievements" / "Достижения") in the type and both dictionaries, reorder the item to title, description, result (bold white line, no VCR), update `CaseDetailPage` and `CLAUDE.md`; verify `bun run test` and `bun run typecheck` pass and `grep -rn "hallenges" src e2e CLAUDE.md` finds nothing
- [x] 9.5 Red then green for the stack frame: add a `CaseStack` test that the card class contains the single shorthand with the outset (`/5px`) and `bg-clip-padding` and no separate `border-image-outset` class, see it fail, then change the classes; verify the test passes
- [x] 9.6 Check the stack card in the Playwright MCP on desktop and mobile against the reference `border.png` (frame lines on the dark background at the left and the bottom, about 30 px wide, white only inside the card, no white notch at the corners), then delete `border.png` from the repository root and verify with `git status` that it is gone
- [x] 9.7 Run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page`; verify they pass (if `test:e2e` shows stale data, the cause is `.next/cache/fetch-cache`, which the user clears)

## 10. Revision: achievements dividers and title

- [x] 10.1 Red: extend `CaseAchievements.test.tsx` so that every item carries a decorative pixel index ("01", "02", ... in list order) hidden from assistive technology (`aria-hidden`), that an item's accessible text is still title, description and result without the index, and that the list has one divider per item boundary; verify the new tests fail
- [x] 10.2 Green: in `CaseAchievements` make the section title larger than the other section titles (24 px, 32 px from `sm`), separate the items with a dashed `border-white/20` rule and add the `font-vcr` `text-white/40` index (beside the text from `sm`, above the title below); keep the accent colour off these elements; verify the tests pass
- [x] 10.3 Check the block in the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px): readable index and dividers, the title clearly larger than "О кейсе" and "Стек", no horizontal scroll, no console errors; then run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass

## 11. Revision: header background behind the menu

- [x] 11.1 Red: in `CaseHeader.test.tsx` assert that the background block is absolutely positioned at the top of the page (`absolute`, `inset-x-0`, `top-0`, `-z-10`) and carries the edge mask, that the `<header>` itself is not `relative` (so the block anchors to `body`), that the image is still decorative (`alt=""`) with the optional blur, and that without `backgroundImage` neither the block nor an `img` is rendered; add a `SiteLayout` check (new `SiteLayout.test.tsx`) that `body` carries `relative`; verify the new tests fail
- [x] 11.2 Green: make `body` in `SiteLayout` `relative`; in `CaseHeader` drop `relative isolate overflow-hidden` from the header, render the absolutely positioned background block (about 480 px, 560 px from `md`) with the masked image, a top scrim and no colour overlay at the edges; keep the content column as is; verify the unit tests and `bun run typecheck` pass
- [x] 11.3 Check in the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px) for `spectre` and `orbit` (no background): the menu and language switcher lie on the picture and stay readable, there is no hard top edge, the bottom still dissolves into the page, the background scrolls together with the content (scroll down and up), no horizontal scroll, the other pages look unchanged, no console errors; tune the mask stops and the scrim as needed
- [x] 11.4 Run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass; update `CLAUDE.md` only if the layout description changes

## 12. Revision: header facts block

- [x] 12.1 Red: extend `CaseHeader.test.tsx` so that the facts form one panel (the `dl` carries the dashed border, `bg-canvas/50` and `backdrop-blur-sm`), every fact is a cell whose `dt` comes before its `dd` and whose label is visually above the value (`flex-col`), the cells are separated by dividers (`lg:[&>div+div]:border-l` and the two-column `nth-child` divider classes on the panel), a `null` `company` or `teamSize` renders no cell, the period value keeps `capitalize`, and the DOM still has one `dt` per shown fact in `ru` and `en`; verify the new tests fail
- [x] 12.2 Green: change the facts markup in `CaseHeader` to the panel with label-over-value cells and dashed dividers (grid of two columns below `lg`, one row from `lg`), keeping the `dl` / `dt` / `dd` semantics and the muted labels; verify the tests and `bun run typecheck` pass
- [x] 12.3 Check in the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px) for `spectre` (four facts) and, through the stub or the unit test, a case with two facts: the cells are clearly separated, nothing merges or clips, the dividers are right when the grid wraps, the labels are legible over the picture, no horizontal scroll, no console errors; tune paddings and the panel opacity as needed
- [x] 12.4 Run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass (if `test:e2e` shows stale data, the cause is `.next/cache/fetch-cache`)

## 13. Revision: facts without a frame, with icons

- [x] 13.1 Red: in `CaseHeader.test.tsx` replace the panel test with one that the `dl` has no border and no fill classes (`border`, `border-dashed`, `bg-canvas/50`, `backdrop-blur-sm`) but keeps the grid, the row from `lg` and the dashed dividers between cells, and add tests that every cell has exactly one decorative icon before its `dt` (`aria-hidden="true"`, `focusable="false"`), that the icon comes from the four assets (role, company, team size, period) and is absent for a cell that is not rendered (`company` / `teamSize` `null`), that the `dt` / `dd` count and order are unchanged in `ru` and `en`; verify the new tests fail
- [x] 13.2 Green: draw the four pixel icons (12x12 grid, `currentColor`, `shape-rendering="crispEdges"`) as `.svg` files in `views/case-details/ui/assets/` and use them with the `?svgr` import before each label (14 px, `text-white/60`); remove the border, the fill and the blur from the `dl`, keep the cells and the dividers; verify the tests and `bun run typecheck` pass
- [x] 13.3 Check in the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px) for `spectre` and for a case with two facts (remove two cells in the DOM when only `spectre` exists): the icons are crisp and aligned with the labels, the cells are still clearly separated, the labels stay legible over the picture (add a light `text-shadow` or a stronger dim behind the block if not), no horizontal scroll, no console errors
- [x] 13.4 Update `CLAUDE.md` only if the description of the case page changes; run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass

## 14. Revision: team cell

- [x] 14.1 Red: in the dictionary tests and `CaseHeader.test.tsx` assert the labels "Команда" (`ru`) and "Team" (`en`), the cell order role, period, company, team (team last, and still last when company is missing), and the unit for team sizes 1, 2, 5, 11, 21, 22 and 25 in `ru` ("человек" / "человека" / "человек" / "человек" / "человек" / "человека" / "человек") and 1 and 6 in `en` ("1 person", "6 people"); add the same value check for `spectre` to `e2e/cases.spec.ts` ("6 человек" / "6 people"); verify the tests fail
- [x] 14.2 Green: change `teamSizeLabel` in the `Dictionary` type and both dictionaries to the short labels and add `teamSizeUnit` (plural forms by category, `other` required); in `CaseHeader` pick the form with `Intl.PluralRules` and move the team cell last; verify the unit tests, `bun run typecheck` and the dictionary parity tests pass
- [x] 14.3 Check in the Playwright MCP on desktop (about 1440 px) and mobile (about 360 px) that the team cell reads as "Команда / 22 человека", the last cell sits correctly in the grid and the row, the dividers are right, no horizontal scroll, no console errors
- [x] 14.4 Run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass (if `test:e2e` shows stale data, the cause is `.next/cache/fetch-cache`)

## 15. Revision: clean CaseHeader and the one-component-per-file rule

- [x] 15.1 Enable `react/no-multi-comp` as `warn` in `eslint.config.mjs`; verify that `bun run lint` reports it for exactly `src/shared/ui/Button.tsx`, `src/views/home/ui/HomePage.tsx` and `src/views/case-details/ui/CaseHeader.tsx` and that the lint still exits 0
- [x] 15.2 Fix the two existing warnings with no behaviour change: move `ButtonContent` of `shared/ui/Button.tsx` and `IntroContent` of `views/home/ui/HomePage.tsx` into files of their own next to them (with their own props types); verify the existing tests and `bun run typecheck` pass and `bun run lint` no longer reports these two files
- [x] 15.3 Commit those two fixes separately: the work is on `main`, so first create a feature branch (for example `feat/case-details-redesign`), stage only the files of 15.2 by path, commit them with a conventional message (for example `refactor(ui): one component per file in Button and HomePage`) and the attribution line; verify with `git show --stat` that the commit holds only these files and that the rest of the change stays uncommitted in the working tree
- [x] 15.4 Take reference screenshots of the `spectre` case header (desktop about 1440 px and mobile about 360 px, `ru` and `en`) through the Playwright MCP before the refactor, to compare after it
- [x] 15.5 Red: write `lib/formatPeriod.test.ts` (ru and en, open end date, no "г."), `lib/formatTeamSize.test.ts` (the plural table for ru and en) and `lib/getCaseFacts.test.ts` (order role, period, company, team; ids, labels and values; no cell for a missing company or team size); verify they fail because the modules do not exist, while the existing `CaseHeader` tests stay green
- [x] 15.6 Green: add `model/types.ts` and `lib/formatPeriod.ts`, `lib/formatTeamSize.ts`, `lib/getCaseFacts.ts`; verify the new unit tests pass
- [x] 15.7 Extract the components into `ui/CaseHeader/` (`CaseHeader.tsx` composition only, `CaseBackground.tsx`, `CaseBackLink.tsx`, `CaseFacts.tsx` mapping over `getCaseFacts`, `FactLabel.tsx`, `factIcons.ts`, the `assets/` icons, `index.ts`); verify the existing `CaseHeader` tests pass unchanged apart from the import path, `bun run lint` reports no `react/no-multi-comp` warning, and `bun run fsd:check` and `bun run typecheck` pass
- [x] 15.8 Redistribute the tests: formatting assertions move to the `lib/` tests, markup assertions to the tests of `CaseBackground`, `CaseBackLink` and `CaseFacts`, and only the integration checks stay in `CaseHeader.test.tsx`; verify that every previous assertion still exists somewhere and that `bun run test:coverage` holds the thresholds
- [x] 15.9 Add the rule to `CLAUDE.md` under Code conventions (a component file holds one component and its props type, JSX is declarative; helpers, types, constants and requests go to `lib/`, `model/`, `config/` and `api/` files by FSD; a second component, a helper, a data type or more than about 100 lines is the signal to extract) and mention the warning rule; verify with grep that the rule is present
- [x] 15.10 Compare the header with the reference screenshots of 15.4 (desktop, mobile, `ru`, `en`: identical, no console errors), then run `bun run check`, `bun run fsd:check`, `bun run test:e2e` and `openspec validate redesign-case-detail-page` and verify they pass
