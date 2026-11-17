# Design

## Context

- `src/views/contacts` holds a placeholder (title + `CursorGlow`); `src/app/[locale]/contacts/page.tsx` already passes `dictionary.pages.contacts` (currently `{ title }`) to it. Page metadata comes from the separate `metadata.contacts` dictionary entry, which stays unchanged.
- Source: `carbontec-site/apps/front/src/components/{ContactsPage,ContactsForm}` (SCSS modules, Strapi data, `react-select`, Telegram bot submit). Layout reference only; nothing is copied verbatim.
- Project constraints (see `CLAUDE.md`): FSD (`views` slice with `ui/lib/model/config`), components visually clean (one component per file, logic in hooks/helpers), every string in both dictionaries, Tailwind 4 tokens, TDD, UI work through `ui-ux-pro-max` and a Playwright MCP check.
- See proposal.md for motivation and scope.

## Goals / Non-Goals

**Goals:**

- Visually close to carbontec (layout, hierarchy, retro feel) but built on this project's tokens and components.
- Form logic isolated in a testable hook; page and components stay declarative.

**Non-Goals:**

- Any network call or backend; a reusable form library; moving `Input`/`Checkbox` beyond what the contacts page needs.

## Decisions

1. **Dictionary shape**: extend `pages.contacts` (it already feeds the view) instead of adding a new top-level key: `title`, `infoText`, `illustrationAlt`, `links` (`email`, `telegram`, `linkedin` aria-labels), `form` (`title`, field labels, `methodLabel`, `methods`, `send`, `errors`, `success`), keyed in the `Dictionary` type and filled in `ru` and `en`. Non-translatable values (URLs, email) live in `views/contacts/config`.
   _Alternative_: separate `contactsPage` key, rejected: splits one page across two keys.
2. **Slice layout** (`src/views/contacts`):
   - `ui/`: `ContactsPage` (composition), `ContactsHeader`, `ContactLinks`, `ContactsInfo`, `ContactForm`, `MethodSelector`, `FormNotice`; each one component per file.
   - `lib/`: `validateContactForm`, `isValidEmail`, `useContactForm` (state, errors, simulated submit, auto-hide timer), `getContactLinks`.
   - `model/`: form types; `config/`: links, limits (100/1000), notice display time.
   - Shared presentation pieces go to `shared/ui`: `Input` (single/multiline, label, error, `aria-invalid`, `aria-describedby`), `Checkbox`, and icons `TelegramIcon`, `LinkedinIcon`, `MailIcon` (SVG via `?svgr`, like the existing icons). The Telegram, LinkedIn and mail icons are SVG assets inside the slice (`ui/assets`, `?svgr`) because only the contact links use them.
     _Alternative_: keep `Input`/`Checkbox` in the slice, rejected: they are generic and FSD allows `shared`.
3. **Simulated submit** lives only in `useContactForm` behind one `submit()`; a `TODO(contacts-delivery)` marker and a "TEMPORARY" paragraph in `CLAUDE.md` make it easy to replace with a real request later. The notice is a toast: a persistent `role="status"` live region rendered as a `fixed` layer in the bottom corner of the viewport (`bottom-4 inset-x-4` on narrow screens, bottom right from `sm`) above the page content, so it never covers the site menu at the top (high z-index, `pointer-events-none`, so it never blocks clicks or the cursor glow), with the retro "system message" box inside it. It does not take part in the form layout, so the form never shifts. It slides in from below with a short animation (none under `prefers-reduced-motion`) and a timer cleared on unmount hides it. On hide it fades out and moves down slightly (`reveal-out`, `TOAST_EXIT_TIME_MS`) and only then leaves the DOM (`useExitTransition`).
4. **Validation timing**: on submit (like the original) and clear a field's error on edit; the length limit is enforced on input. Native `required` attributes are not used for blocking (`noValidate`) so errors are localized and styled consistently.
5. **Native elements**: the method choice is a group of real radio inputs (always one selected, Email by default) inside a `fieldset`/`legend`; fields use `<label htmlFor>`. Gets keyboard and screen-reader support for free.
6. **Layout**: Tailwind breakpoints replace the SCSS mixins: mobile stacked, `md` widens info block, `lg` form left / info right (`flex-row-reverse` equivalent order via DOM order: info first on mobile as in the original, form left from `lg`). The page scrolls inside the existing site layout; `CursorGlow` stays.
7. **Animation**: `Reveal` with `trigger="mount"` for title/links and info, `visible` for the form (it can be below the fold on mobile); stagger like the case page. Never wrap `CursorGlow` in a translating `Reveal`.
8. **Visual design**: run the `ui-ux-pro-max` skill before building the components; the success toast is styled as a retro "system message" box in the project's palette (accent/control tokens), not a copy of the original green text.
   - Input colours: hover uses the `focus-ring` (pink) border and focus uses the `accent` (purple) border (the reverse of the first pass).
   - Contact links: the email and the icon links sit on two rows (email, then the Telegram and LinkedIn icons) at every width, white by default and `accent` on hover and focus.
   - Checkbox: a centring offset for the inner square was tried and rolled back at the user's request; the mark is back in its original, plain position inside the box.
9. **Illustration**: copy `bg-contacts-page.svg` to `public/` and render with `next/image` and a dictionary `alt`.

10. **Single contact field (no layout jump)**: the form always has exactly one contact field in one slot below the method. State keeps `email` and `telegram` values separately plus `method` (`"email"` by default, never empty); the field shown depends on `method`, so switching swaps the slot in place with no height change and no animation needed. `setMethod` replaces `toggleMethod`; there is no "username visible" flag. Validation checks only the shown contact field (email: required and valid; Telegram: required). Switching clears the contact errors, a successful submit clears all values and returns to Email. `Checkbox` gets a `type` prop (`"checkbox"` default, `"radio"`) with a shared `name` so the method group uses native radios (arrow keys, one Tab stop) with the existing look. _Alternative_: animated expand/collapse of an extra field, rejected: it only softens the jump. _Alternative_: separate Radio component, rejected: duplicates the Checkbox markup.

## Risks / Trade-offs

- [Visitors believe a message was sent] → documented TEMPORARY simulation in `CLAUDE.md` and the proposal; the success text is the requested one, replacing it is a one-line follow-up when delivery exists.
- [Long Russian labels overflow on 320 px] → wrapping layout for methods and labels, verified on 320/375 in the visual check.
- [Cursor glow vs. new interactive elements] → the glow is `pointer-events-none`; E2E clicks cover it.
- [Placeholder test and `pages.spec.ts` assert the old page] → update them in the same change.
- [`react-select` absent] → intentional; no new dependency.

## Open Questions

- Exact vertical offset of the toast relative to the site menu is chosen during the visual check; it does not change specs or tasks.
