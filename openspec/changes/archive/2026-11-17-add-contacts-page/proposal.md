# Proposal

## Why

`/ru|en/contacts` is a placeholder that shows only the page title. Visitors have no way to reach the author. The page needs a header with contact links, an illustrated info block and a message form, built with this project's stack, design tokens, FSD layout and i18n.

## What Changes

- Replace the placeholder `ContactsPage` (`src/views/contacts`) with the full page: title on the left and contact links on the right; on desktop the form on the left and the info block (text + "computer" illustration) on the right; stacked on mobile and tablet.
- Contact links: email `alexxaandr.m@gmail.com` (`mailto:`), Telegram `https://t.me/alexxaandr`, LinkedIn `https://www.linkedin.com/in/alexxaandr` (LinkedIn replaces the original X icon). No phone number, no WhatsApp, no X.
- Message form "start work" with fields: name / company, email, preferred method of communication (Telegram or Email, Email by default, always one selected; no Phone), one contact field under it that is the email field for Email and is replaced in place by the number-or-username field for Telegram (so the form height never jumps), message. No "Service" dropdown.
- Required-field validation (name, email format, message) with localized error messages and length limits like the original.
- **Simulated submit (TEMPORARY)**: nothing is sent. A valid submit clears the fields and shows a "thank you, your message was sent" popup notification in the bottom corner of the page (never over the site menu) (no close button, it hides by itself after a few seconds). Documented as temporary in `CLAUDE.md`; a real channel is a separate task.
- Move all user-facing text (including "If you have a new idea to show the world, send us a message, we are always open for new collaborations", form labels, errors, `aria-label`s, illustration alt) into the `ru` and `en` dictionaries.
- New shared UI in `shared/ui`: `Input` (single-line and multiline) and `Checkbox` in the retro style of this project, plus the Telegram, LinkedIn and mail icons.
- Copy `bg-contacts-page.svg` to `public/`.
- Entrance animations via the existing `Reveal`; the existing `CursorGlow` stays.
- Update `CLAUDE.md` and `README.md` for the new architecture.
- Tests: Vitest units, Playwright E2E, and a visual responsive check (Playwright MCP) in both locales.

## Capabilities

### New Capabilities

- `contacts-page`: content, contact links, message form (fields, validation, simulated submit), localization and responsive layout of the contacts page.

### Modified Capabilities

<!-- None. `cursor-glow` already lists the contacts page; its requirements do not change. -->

## Impact

- Code: `src/views/contacts` (ui, model, lib, config), `src/shared/ui` (Input, Checkbox, icons), `src/shared/i18n` (`Dictionary` type), `src/shared/i18n-server/dictionaries/{ru,en}.ts`, `src/app/[locale]/contacts/page.tsx`, `public/`.
- Tests: colocated Vitest files, a new `e2e/contacts.spec.ts`, updates to `e2e/pages.spec.ts` if it asserts the old placeholder.
- Docs: `CLAUDE.md`, `README.md`.
- Dependencies: none new (no react-select; the Service dropdown is dropped).

## Out of Scope

- Real message delivery (no API route, Telegram bot, backend or email service); the original `/api/send-message-to-bot` and `useContactsForm` submit logic are not ported.
- Phone number and phone method, WhatsApp, X, and the "Service" field with its Strapi data.
- Spam protection, rate limiting, analytics.
- Changes to the cases, case-details or home pages, and to the in-flight changes `handle-missing-project-link` and `add-product-role`.
- Pixel-exact styling from a mockup; the layout and feel are built with Tailwind and this project's tokens.
