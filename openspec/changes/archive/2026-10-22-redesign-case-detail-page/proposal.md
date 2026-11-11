# Proposal

## Why

The case page is a single `RetroWindow` with the picture beside it and every fact in one dense block. It does not use the new `backgroundImage` / `backgroundBlurImage` fields the backend already returns, and it gives the stack, the description and the achievements no visual structure. The carbontec case page has a clearer layout (hero header, "About case", highlighted blocks) that fits our case structure.

## What Changes

- Replace the `RetroWindow` layout of the case page with a sectioned page:
  - **Header**: full-width background from `backgroundImage` (with `backgroundBlurImage` as the placeholder), a back link to the cases list, the case `category`, the `h1` with the case name and a compact facts line (role, company, team size, period).
  - **About case**: the `description` and the project link button only.
  - **Stack**: the technologies as a "code" card framed with `code-border.png`.
  - **Achievements**: the `achievements`, each as title, description and result (the `metric`).
- Add `public/code-border.png` (copied from carbontec-site).
- Add dictionary keys (`ru` and `en`) for the new section titles; drop keys that no longer have a use.
- Stop using `RetroWindow` on the case page (it stays on the list page).
- Stop showing the case picture `image` on the case page (**BREAKING** for the "Case without a picture" requirement, which is removed); the picture stays in the cases list.
- Move the header background to the top of the page so it lies behind the site menu and language switcher, with its top and bottom edges dissolved instead of cut off.
- Keep the accent (purple) colour for the links only (back to the list, project link); section titles are white and the category and fact labels are muted.
- Show period dates without the Russian year suffix "г." ("апрель 2023 – сентябрь 2026").
- Shorten the team label to "Команда" / "Team", move that cell last and show the number with a unit that agrees with it ("22 человека", "6 people").
- Show the header facts (role, company, team size, period) as labelled cells with pixel icons and dashed dividers, without a frame or a fill, instead of one run-on line.
- Give the Achievements block a larger title and dashed dividers with a muted pixel index per item.
- Fix the stack frame so it matches the reference picture: full-width frame lines on the dark background and the white fill only inside the card.
- Refactor `CaseHeader` into focused files by FSD segment (helpers in `lib/`, types in `model/`, subcomponents in their own files) without changing behaviour or looks, and write the rule "components are visually clean, everything else goes to FSD files" into `CLAUDE.md`, backed by the ESLint rule `react/no-multi-comp` as a warning; the two existing warnings (`Button`, `HomePage`) are fixed in a separate commit.
- Rewrite the case page tests and the case e2e for the new structure.

Out of scope:

- The cases list page (including its use of the case picture) and `RetroWindow` itself.
- Any other use of `image` / `blurImage` on the case page: the page does not show or request them.
- Backend and API contract changes (`backgroundImage` and `backgroundBlurImage` are already in `schema.d.ts` and the stub fixtures).
- Other carbontec sections (team, services, articles, related cases, playground, GitHub link, CMS content blocks).
- Case metadata, routing, slugs and the build-time backend requirement.
- Turning `react/no-multi-comp` into an error and refactoring the other components of the slice (they are already small).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `case-details`: the page structure and content (header with background and category, About case, stack card, achievements with their result, period dates without the year suffix) and the missing-background behavior; the "Case without a picture" requirement is removed because the page no longer shows the case picture; the requirements for the role label, the project facts and the backend source keep their behavior.

## Impact

- Code: `src/views/case-details/ui/` (new section components, rewritten `CaseDetailPage` and its test), `src/shared/ui/ImageWithFallback` (no change in the end result), `src/shared/i18n` (`Dictionary` type) and `src/shared/i18n-server/dictionaries/{ru,en}.ts`, `public/code-border.png`, `e2e/cases.spec.ts`.
- No new dependencies and no API changes.
- Docs: `CLAUDE.md` / `README.md` only if the described `case-details` slice structure changes.
