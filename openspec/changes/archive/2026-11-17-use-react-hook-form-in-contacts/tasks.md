# Tasks

## 1. Dependencies

- [x] 1.1 Record the baseline `/contacts` first-load JS size from the `pnpm build` output, then install `react-hook-form`, `zod` and `@hookform/resolvers` with `pnpm add --save-exact`, check that the peer ranges include React 19 and that the resolvers major matches the zod major, and verify `pnpm typecheck` and `pnpm build` still pass with the dependencies added but unused

## 2. Schema (TDD)

- [x] 2.1 Red: unit tests for `model/contactSchema` replacing the `validateContactForm` tests (name and message required, whitespace-only counts as empty, Email requires a valid address and an empty email reports only `required`, Telegram requires a value, the inactive contact field is not checked, 100/1000 limits report `tooLong`, messages are the code strings); verify they fail
- [x] 2.2 Implement `contactSchema` (flat `z.object` with `superRefine`, reusing `isValidEmail` and the limit constants) and infer `ContactFormValues`, `ContactMethod` and `ContactFieldName` from it (`validateContactForm` stays until the hook stops using it, see 3.3); verify the unit tests pass and `pnpm typecheck` passes

## 3. Hooks (TDD)

- [x] 3.1 Red then green: `lib/useSuccessNotice` tests with fake timers (`show` sets `isSent`, hides after `SUCCESS_NOTICE_TIME_MS`, a repeat restarts the timer, the timer is cleared on unmount), then implement it; verify the tests pass
- [x] 3.2 Red: rewrite the `useContactForm` tests for the React Hook Form and zod version (defaults with Email selected, limit rejection while typing with `tooLong`, error cleared on edit, method switch clears the contact errors and keeps both values, invalid submit sets error codes and keeps the values, valid submit resets to defaults and shows the notice, no `fetch` call); verify they fail
- [x] 3.3 Implement `useContactForm` with `useForm` and `zodResolver` (`mode` and `reValidateMode` `"onSubmit"`, `shouldUnregister: false`), the change handler, `selectMethod` and `handleSubmit`, keeping the `TODO(contacts-delivery)` marker, then remove `validateContactForm` and its test; verify the hook tests pass and nothing imports the removed file

## 4. UI

- [x] 4.1 Add `ui/ContactTextField` (`Controller` + `Input` + localized error text) with a component test (label association, `aria-invalid` and description from the error code, `onChange` receives text); verify the test passes
- [x] 4.2 Refactor `ContactForm` and `MethodSelector` to the new hook and `ContactTextField` without changing their rendered output; verify that `ContactForm.test.tsx` and `ContactsPage.test.tsx` pass unchanged and `pnpm lint` shows no `react/no-multi-comp` warnings
- [x] 4.3 Run `e2e/contacts.spec.ts` and the Playwright MCP check at 375 and 1280 px in `ru` and `en` (validation errors, switching Telegram and Email without a height jump, submit and the notification, no console errors); verify nothing looks or behaves differently from before

## 5. Docs and final checks

- [x] 5.1 Update `CLAUDE.md` and `README.md` (contacts form uses React Hook Form with a zod schema: `model/contactSchema`, `useForm` settings, `Controller` fields, `useSuccessNotice`); verify they no longer mention the removed custom validation
- [x] 5.2 Run `pnpm check`, `pnpm fsd:check` and the full `pnpm test:e2e`; compare the `/contacts` first-load JS with the baseline from 1.1; verify all pass and list the changed areas, the tests, the size comparison and the results in the final answer

## 6. Switch to zod/mini

- [x] 6.1 Red then green: move `model/contactSchema.test.ts` to the `zod/mini` API (`safeParse(contactSchema, value)`), watch it fail against the classic-zod schema, then rewrite `model/contactSchema.ts` on `zod/mini` (`.check(z.check(...))`, `context.issues.push`) with the same rules and codes; verify the 13 schema tests pass and `pnpm typecheck` passes without casts
- [x] 6.2 Verify that nothing else changes: `useContactForm`, `ContactForm`, `ContactsPage` and `e2e/contacts.spec.ts` stay unedited and green, and no file imports from `"zod"` (only `"zod/mini"`)
- [x] 6.3 Compare the `/contacts` client chunk size with the classic-zod result (64.4 KB gzip; expected about 49.6 KB), update `CLAUDE.md` (schema on `zod/mini`, import only `zod/mini`), and run `pnpm check`, `pnpm fsd:check` and the full `pnpm test:e2e`; verify all pass

## 7. Simplify the form wiring

- [x] 7.1 Red: update `ContactForm.test.tsx` for the spec delta (the four fields have `maxLength` 100/100/100/1000; typing past the limit stops at the limit and shows no message; a "required" error disappears on the first character; an "invalid email" error stays while the address is still invalid and disappears once it is valid; switching the method does not leave a stale contact error); verify the tests that differ from today fail
- [x] 7.2 Red then green: rewrite the `useContactForm` tests for the slim hook (`methods`, `submit`, `isSent`: defaults with Email, an invalid submit gives the schema codes for the right fields including the Telegram case, a valid submit resets to defaults and shows the notice, no `fetch` call) and make `getFieldErrorText` tests cover a message string and an unknown value; then slim down `useContactForm` and `getFieldErrorText`; verify the tests pass
- [x] 7.3 Implement the context wiring: `FormProvider` in `ContactForm`, `ContactTextField` on `useController` with `maxLength` and the localized error (new tests for it), `MethodSelector` on `useController` with `clearErrors` on change, `useWatch` for the method; remove `setField`, `selectMethod`, `getErrorCodes` and its test; verify all contacts unit tests pass, `pnpm lint` has no warnings about React Compiler or `react/no-multi-comp`, and `grep` finds no `onValueChange` or `setField`
- [x] 7.4 Add an E2E check in `e2e/contacts.spec.ts` that typing past 100 characters into the name stops at 100 without a message, run the whole contacts spec and the Playwright MCP check at 375 and 1280 px in `ru` and `en` (errors, switching, submit and the notification, no console errors); verify behavior matches the spec delta
- [x] 7.5 Update `CLAUDE.md` and `README.md` (slim hook, `FormProvider` + `useController`, `maxLength`, no `setField`), run `pnpm check`, `pnpm fsd:check` and the full `pnpm test:e2e`, compare the `/contacts` client chunk size with 49.6 KB gzip (it should stay about the same), and verify `openspec validate --strict` passes

## 8. Use z.email()

- [x] 8.1 Red then green: add schema tests that `a..b@c.com`, `.a@b.com`, `a@-b.com` and `юзер@пример.рф` are invalid while `alex.m+tag@gmail.com` stays valid, then replace `isValidEmail` in `contactSchema` with `z.email()` and delete `lib/isValidEmail.ts` and its test; verify the schema and form tests pass and nothing imports the removed files
- [x] 8.2 Update `CLAUDE.md` if it mentions the custom check, run `pnpm check`, `pnpm fsd:check` and the full `pnpm test:e2e`, and compare the `/contacts` chunk size; verify all pass

## 9. Built-in zod checks

- [x] 9.1 Refactor `model/contactSchema.ts` to zod's own checks (`z.trim()`, `z.minLength()`, `z.maxLength()`, `z.email()`, `z.pipe()`) in a `z.discriminatedUnion("method", …)`, removing the hand-written `check`, `report` and `TextField`; the existing schema, hook, form and E2E tests stay unchanged as the safety net; verify they all pass and `pnpm typecheck` passes without casts
- [x] 9.2 Add the "prefer the standard solution over custom code" rule to the code conventions in `CLAUDE.md`, update the contacts paragraph, then run `pnpm check`, `pnpm fsd:check` and the full `pnpm test:e2e` and compare the `/contacts` chunk size; verify all pass

## Workflow follow-up

- Archive the change after review (`/opsx:archive`); the delta for `contacts-page` ("Form validation") is synced to the main spec.
