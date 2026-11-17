# Proposal

## Why

The contacts form runs on hand-written form state: `useContactForm` keeps the values, the errors, the limit checks and the "clear the error on edit" rules in its own `useState` calls, `validateContactForm` re-implements validation, and `ContactFormValues` is typed by hand next to it. This is code the project has to maintain and test itself, and every new field or rule means editing several places. React Hook Form removes the state handling, and a zod schema turns the rules and the types into one declaration that can also be reused on the server when real message delivery is added.

## What Changes

- Add `react-hook-form` (v7), `zod` and `@hookform/resolvers` (exact version pins like the other dependencies). The schema uses `zod/mini` (the same package, the tree-shakable functional API) to keep the client bundle small.
- Describe the form once in a zod schema (`model/`): required name and message, a method-dependent contact field (valid email for Email, required value for Telegram) and the 100/1000 character limits. The schema returns the same error codes as today (`required`, `invalidEmail`, `tooLong`), so the localized messages stay in the dictionaries and `getFieldErrorText` stays as it is. `ContactFormValues` is inferred from the schema. Written with `zod/mini`, not classic zod.
- Rewrite `useContactForm` on `useForm` with `zodResolver`: values, errors, submit handling and reset come from the library instead of custom `useState` state.
- Render the fields through `FormProvider` and `useController`, so `ContactTextField` and `MethodSelector` read and write the form themselves (no `control`, `onValueChange` or `setField` wiring), and let the library do what it does by default: write values through `field.onChange` and re-validate an invalid field while it is edited. The shared `Input` and radio `Checkbox` keep their API.
- Replace `validateContactForm` with the schema (the email rule is zod's own `z.email()`; the hand-written `isValidEmail` is removed, and the rule becomes a bit stricter: for example `a..b@c.com`, `a@-b.com` and addresses with non-Latin letters are no longer accepted).
- Limit the length with the native `maxLength` attribute (100 for name, email and Telegram, 1000 for the message) instead of the hand-written "reject the character and set an error" code.
- Extract the temporary success notice (show, auto-hide timer, restart on a repeat) from the form hook into its own small hook.
- Update `CLAUDE.md` and `README.md`.

Two small, deliberate behavior changes come with this simplification (spec delta below): the "too long" message is no longer shown (the field simply stops at the limit), and a field error that is still invalid stays while the visitor types, for example "invalid email", and disappears once the value is valid (before, any edit cleared it). Everything else (page, texts, the other validation messages, the single contact field, the simulated submit and the notification) stays as specified.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `contacts-page`: "Form validation" (the length limit is enforced by the field itself without a message; an error clears once the value is valid, not on any edit).

## Impact

- Code: `src/views/contacts/model` (schema, inferred types), `src/views/contacts/lib` (`useContactForm`, a new success-notice hook, removed `validateContactForm`), `src/views/contacts/ui` (`ContactForm`, a small field wrapper).
- Dependencies: adds `react-hook-form`, `zod` and `@hookform/resolvers` (client-side runtime dependencies); the size of the `/contacts` client chunks is compared before and after (measured in the first pass with classic zod: +44.6 KB gzip; with `zod/mini`: +29.8 KB gzip).
- Tests: the schema, hook and validation unit tests are rewritten; the component tests (`ContactForm`, `ContactsPage`) and `e2e/contacts.spec.ts` stay unchanged and act as the regression net.
- Spec: delta for `contacts-page` (requirement "Form validation").
- Docs: `CLAUDE.md`, `README.md`.

## Out of Scope

- Any change of what the form does or shows (fields, order, texts, limits, notification), including the question of moving the email field first.
- Real message delivery, server actions, an API route or server-side validation (the schema is only kept framework-free so it can be reused there later; the submit stays a TEMPORARY simulation).
- Moving `Input`, `Checkbox` or other forms to React Hook Form or zod.
