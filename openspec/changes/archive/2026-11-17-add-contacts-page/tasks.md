# Tasks

## 1. Dictionaries and config

- [x] 1.1 Red: extend `ContactsPage.test.tsx` (and add a dictionary parity test if none exists) to expect the new `pages.contacts` keys in `ru` and `en`; verify `pnpm test` fails for the missing keys
- [x] 1.2 Extend the `Dictionary` type and fill `ru` and `en` (`title`, `infoText`, `illustrationAlt`, `links`, `form` labels, method labels, `send`, `errors`, `success`); verify `pnpm typecheck` passes and the tests from 1.1 go green
- [x] 1.3 Add `views/contacts/config` (email, Telegram and LinkedIn URLs, field limits 100/1000, notice display time); verify it is imported only through the slice and `pnpm lint` passes
- [x] 1.4 Add `bg-contacts-page.svg` to `public/`; verify the file exists and renders via `next/image`

## 2. Form logic (TDD)

- [x] 2.1 Red: unit tests for `validateContactForm` / `isValidEmail` (required, invalid email, length limits, both locale messages); verify they fail
- [x] 2.2 Implement the validation helpers in `views/contacts/lib`; verify the tests pass
- [x] 2.3 Red: hook tests for `useContactForm` with fake timers and `fireEvent`-style updates (exclusive method toggle, username visibility, error clears on edit, simulated submit clears fields, notice auto-hides, no `fetch` call, timer cleaned on unmount); verify they fail
- [x] 2.4 Implement `useContactForm` with a single `submit()` and a `TODO(contacts-delivery)` marker; verify the tests pass

## 3. Shared UI

- [x] 3.1 Invoke the `ui-ux-pro-max` skill and decide the visual treatment of fields, method options, errors and the success notice in the retro style; record the decision in `design.md` Open Questions as resolved
- [x] 3.2 Red then green: tests and implementation for `shared/ui` `Input` (single and multiline, label association, `aria-invalid`, `aria-describedby`, error text) and `Checkbox` (checked state, keyboard toggle, accessible name); verify the component tests pass
- [x] 3.3 Add the Telegram, LinkedIn and mail SVG icons in `views/contacts/ui/assets` (used decorative, `aria-hidden`) and export `Input` and `Checkbox` through `@/shared/ui`; verify `pnpm typecheck` and `pnpm lint` pass

## 4. Page UI

- [x] 4.1 Red: component tests for `ContactsPage` in both locales (title, three links with exact `href`, no `tel:`/WhatsApp/X, info text, illustration `alt`, form title, no service dropdown, no Phone option, `CursorGlow` present); verify they fail
- [x] 4.2 Implement `ContactsHeader`, `ContactLinks`, `ContactsInfo`, one component per file with logic in `lib/`; verify the link and info tests pass
- [x] 4.3 Implement `ContactForm`, `MethodSelector`, `FormNotice` wired to `useContactForm`; verify form tests pass (validation errors, Telegram shows username, success notice in `role="status"`)
- [x] 4.4 Compose `ContactsPage` with Tailwind layout (stacked below `lg`, form left and info right from `lg`) and `Reveal` (`mount` for header and info, `visible` for the form), keep `CursorGlow` outside any translating `Reveal`; verify all component tests pass and `pnpm lint` has no `react/no-multi-comp` warnings
- [x] 4.5 Update `src/app/[locale]/contacts/page.tsx` if the prop shape changed and keep `generateMetadata` intact; verify the existing metadata tests still pass

## 5. E2E

- [x] 5.1 Add `e2e/contacts.spec.ts` for `/ru/contacts` and `/en/contacts`: links and targets, removed contacts absent, validation errors, successful simulated submit with no network request, notice disappearing, Tab order; verify `pnpm test:e2e` passes on desktop and mobile projects
- [x] 5.2 Update `e2e/pages.spec.ts` (and `cursor-glow.spec.ts` if it relies on the placeholder text) for the new page content; verify the whole E2E suite is green

## 6. Visual check and docs

- [x] 6.1 Playwright MCP check at 320, 375, 768, 1280 and 1440 px in `ru` and `en`: no clipped or overlapping text, no horizontal scroll, focus and hover states visible, success notice looks right, no console errors; fix findings and re-run
- [x] 6.2 Update `CLAUDE.md` (contacts slice, `Input`/`Checkbox` in `shared/ui`, TEMPORARY simulated submit, contacts E2E spec) and `README.md`; verify they describe the new structure
- [x] 6.3 Run `pnpm check` and `pnpm fsd:check` (report `EMFILE` as an environment blocker if it occurs) and `pnpm test:e2e`; verify all pass and list changed areas, added tests and results in the final answer

## 7. Review follow-ups

- [x] 7.1 Red then green: tests for the toast (the notice is a `fixed` top layer inside a `role="status"` region, has no close button, the form is not shifted) in `ContactForm`/`FormNotice` tests, then implement it; verify the component tests pass
- [x] 7.2 Red then green: `ContactLinks` tests for the two-row layout (email row, then the icon row) and the white default and accent hover/focus colours, then implement; verify the tests pass
- [x] 7.3 Swap the `Input` hover and focus border colours (hover pink, focus purple) and centre the `Checkbox` inner square; verify the `Input` and `Checkbox` tests pass and the Playwright MCP check shows equal gaps around the square
- [x] 7.4 Update `e2e/contacts.spec.ts` (toast visible at the top and the form does not move, icons below the email, notice disappears by itself); verify `pnpm test:e2e` passes on desktop and mobile
- [x] 7.5 Playwright MCP check at 320, 375, 768 and 1280 px in `ru` and `en`: icons under the email on every width, toast visible and not clipped, hover and focus colours; fix findings and re-run
- [x] 7.6 Update `CLAUDE.md` (the toast notice) and run `pnpm check`, `pnpm fsd:check` and `pnpm test:e2e`; verify all pass

## 8. Single contact field

- [x] 8.1 Red then green: update `validateContactForm`, `getFieldLimit` and `useContactForm` tests and code for `method` (Email default, never empty), the shown contact field only (`email` or `telegram`), kept values per field, `setMethod`, reset to Email after submit; verify the unit tests pass
- [x] 8.2 Red then green: `Checkbox` tests and code for `type="radio"` with a shared `name` (native radio group, arrow keys, no deselect); verify the `Checkbox` tests pass
- [x] 8.3 Red then green: `MethodSelector` and `ContactForm` tests and code for the new order (name, method, one contact field, message), Email default, Telegram replaces the field in place, no extra field, errors per active field; verify the component tests pass
- [x] 8.4 Update `e2e/contacts.spec.ts`: Email default, switching swaps the field, the message field and Send keep their positions on switch and after submit, Tab order (name, method group, contact field, message, Send), empty Telegram submit; verify `pnpm test:e2e` passes on desktop and mobile
- [x] 8.5 Playwright MCP check at 320, 375, 768 and 1280 px in `ru` and `en`: no height jump when switching or after submit, no clipping, focus states visible, no console errors
- [x] 8.6 Update `CLAUDE.md` (single contact field, radio method) and run `pnpm check`, `pnpm fsd:check` and `pnpm test:e2e`; verify all pass

## 9. Toast in the corner

- [x] 9.1 Red then green: `FormToast` test (a `fixed` layer anchored to the bottom, not the top) and the E2E test (toast in the lower half of the viewport, not overlapping the site menu, form not moved) fail first, then move the toast to the bottom corner (bottom right from `sm`), enter from below and exit downwards; verify the unit and E2E tests pass
- [x] 9.2 Playwright MCP check at 320, 375, 768 and 1280 px in `ru` and `en`: the toast never overlaps the menu or clips; update `CLAUDE.md`; run `pnpm check`, `pnpm fsd:check` and `pnpm test:e2e`; verify all pass

## Workflow follow-up

- Archive the change after review (`/opsx:archive`), which adds `contacts-page` to the main specs.
- Separate task: real message delivery to replace the simulated submit (remove the `TODO(contacts-delivery)` marker and the TEMPORARY note in `CLAUDE.md`).
