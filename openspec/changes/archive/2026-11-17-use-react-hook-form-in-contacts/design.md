# Design

## Context

- `useContactForm` (`src/views/contacts/lib`) owns `values`, `errors`, `isSent`, a notice timer, `setField` (limit check, clears the field's error), `setMethod` (clears the contact errors) and `submit` (validates with `validateContactForm`, then clears everything and shows the notice). `ContactForm` renders the fields and calls it. `ContactFormValues` and the error types are written by hand in `model/types.ts`.
- The contract to keep is the existing `contacts-page` spec and the tests built on it: `ContactForm.test.tsx`, `ContactsPage.test.tsx`, `e2e/contacts.spec.ts`. They exercise behavior only, so they are the regression net for this refactor.
- Fields: `name`, `email`, `telegram`, `message` plus `method` (`"email" | "telegram"`). Only one of `email` / `telegram` is mounted at a time; both values must survive switching.
- React Hook Form (checked in its docs): `shouldUnregister: false` retains the values of unmounted fields; `reValidateMode: "onSubmit"` stops re-validation while typing. With a resolver, the whole values object is validated, including fields that are not mounted, so conditions must live in the schema, not in field mounting.
- The project has no schema library yet and its API types come from OpenAPI. See proposal.md for motivation and scope.

## Goals / Non-Goals

**Goals:**

- The same page behavior (except the two small changes in the spec delta) with far less custom form code, and one declaration of rules and types.
- Keep the shared `Input` and `Checkbox` APIs and the dictionary-based error texts.
- A schema that does not depend on React, so it can be shared with a server handler later.

**Non-Goals:**

- New validation rules or changes to specs; server-side validation itself.

## Decisions

1. **Libraries and versions**: `react-hook-form` 7.x, `zod` and `@hookform/resolvers`, all pinned exactly (`pnpm add --save-exact`). The code imports only `zod/mini`, never `zod`: measured in `pnpm build`, `/contacts` grew by +44.6 KB gzip with classic zod and by +29.8 KB with `zod/mini` (about 14.8 KB less), the resolver accepts a mini schema and returns the same error codes, and all contacts tests passed on it. Pick the resolvers major that supports the installed zod major (the resolvers have separate typings for zod 3 and zod 4) and confirm the peer ranges include React 19 and react-hook-form 7 before using them.
   _Alternative_: built-in `register` rules without zod, considered and rejected because the schema gives inferred types, one place for the method-dependent rule and a shape that a future server handler can import.
2. **One zod/mini schema built from zod's own checks** in `model/contactSchema.ts`: a text rule `z.string().check(z.trim(), z.minLength(1, "required"), z.maxLength(max, "tooLong"))`, the email as `z.pipe(text(100), z.email("invalidEmail"))` (the pipe stops at the first failure, so an empty email reports only `"required"`), and `z.discriminatedUnion("method", [emailVariant, telegramVariant])` where each variant checks its own contact field and keeps the other one as a plain string, so only the shown contact field is validated and both values stay in the form. There is no hand-written `check`, `trim` or length code. (The first version used a flat object with one custom `check`; a prototype showed the built-in checks give identical results and `tsc --strict` accepts the union type with `useForm`, `useController`, `reset`, `setValue` and `clearErrors`.)
3. **Error values are codes, not texts**: the schema messages are `"required" | "invalidEmail" | "tooLong"`; `getFieldErrorText` maps them to the dictionary texts as it does now.
4. **Types from the schema**: `ContactFormValues = z.infer<typeof contactSchema>` (the type works on a mini schema too), `ContactMethod` from the enum; the hand-written value and error types are removed or derived from these.
5. **Let the library do the work**: `useForm<ContactFormValues>({ resolver: zodResolver(contactSchema), defaultValues })` with the defaults (`mode: "onSubmit"`, `reValidateMode: "onChange"`, `shouldUnregister: false`). Values are written by `field.onChange`; an invalid field is re-validated while it is edited, so its error disappears as soon as the value is valid (no hand-written `clearErrors` on edit); values of the contact field that is not shown are kept. This replaces the earlier explicit `reValidateMode: "onSubmit"` plus `setField`.
6. **Length limits with `maxLength`**: `ContactTextField` gives `Input` a `maxLength` from `getFieldLimit(name)` (100, message 1000). The browser stops typing and pasting at the limit (the schema counts the same UTF-16 length). The hand-written reject-and-`setError` code is removed. The schema's max rules and the `tooLong` dictionary text stay as a fallback and for a future server handler, but the page no longer shows them in normal use.
7. **Fields use the form through context**: `ContactForm` wraps its content in `FormProvider`. `ContactTextField` takes `name`, label and input attributes plus the dictionary `errorTexts`, calls `useController({ name })`, renders `Input` with `field.value`, `field.onChange`, `maxLength` and the localized text of `fieldState.error` (via `getFieldErrorText`). `MethodSelector` uses `useController({ name: "method" })` and calls `clearErrors(["email", "telegram"])` when the method changes (one line, so a stale error is not shown when switching back). `ContactForm` reads the method with `useWatch({ name: "method" })` to choose the contact field. No `control`, `onValueChange` or `setField` is passed around.
8. **Slim hook**: `useContactForm()` is `useForm` + `handleSubmit` + the notice and returns `{ methods, submit, isSent }` (`methods` is the `useForm` result handed to `FormProvider`). `setField`, `selectMethod`, `getValues` and the error-code mapping disappear; `getErrorCodes` and its test are removed and `getFieldErrorText` accepts the error message string and ignores unknown values.
9. **Submit**: `handleSubmit(onValid)`; `onValid` is the TEMPORARY simulation: `reset(defaultValues)` and show the notice (keep the `TODO(contacts-delivery)` marker). `reset` inside the callback is verified to work.
10. **Success notice hook**: `lib/useSuccessNotice.ts` owns `isSent`, `show()` and the auto-hide timer (restarted on a repeat, cleared on unmount), so each hook has one job.
11. **Spec delta**: "Form validation" changes in two ways: the field stops at the limit without a message, and an error clears once the value is valid instead of on any edit. (The scenario "Layout and colours of the links" sits under "Form validation" in the main spec by an earlier mistake; the validator does not allow moving it inside a MODIFIED block, so it stays and can be fixed in a separate change.)
12. **Cleanup**: remove `setField`, `selectMethod`, `getErrorCodes` (and its test) and the old hook tests that exercised them; `isValidEmail` is removed in favor of `z.email()` (same check, stricter: it rejects consecutive dots, a leading or trailing dot in the local part, a leading hyphen in the domain, underscores in the domain and non-ASCII letters, and accepts the same ordinary addresses); `getFieldLimit` stays (it now feeds `maxLength`).

## Risks / Trade-offs

- [Bundle size: three new client dependencies] → `zod/mini` is used (about 15 KB gzip smaller than classic zod); about +30 KB gzip remains on `/contacts`, mostly `react-hook-form` and the resolver. Import only `zod/mini`: one import of classic `zod` brings the larger runtime back, so check the imports and the `pnpm build` chunk size. Mini has no method chaining (`schema.safeParse` becomes `safeParse(schema, value)`), which the schema tests account for.
- [Behavior drift (kept values, reset, error codes, when an error clears)] → the `ContactForm`, `ContactsPage` and E2E tests keep running against the new wiring; the tests for the two deliberate changes (no length message, error stays while still invalid) are written first (red).
- [Visible behavior change: no "too long" message, an invalid error stays while typing] → recorded in the spec delta; the message is not needed because the field cannot exceed the limit.
- [Browser `maxLength` and the schema must agree] → both use `getFieldLimit` / the same config constants; the schema max rules stay as a fallback.
- [Resolver validates unmounted fields] → the conditional rule lives in the schema (decision 2), with schema tests for both methods and for an inactive field holding an invalid value.
- [zod and resolvers version pairing (zod 3 vs 4 typings)] → decision 1; `pnpm typecheck` must pass without casts.
- [`reset` timing inside `handleSubmit`] → verified to work in the hook tests; if it ever misbehaves, move it to an effect on `formState.isSubmitSuccessful`.
