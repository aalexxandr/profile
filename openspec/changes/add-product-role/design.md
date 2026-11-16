## Context

`role` flows from the backend through the generated `Schemas` types into `getCaseFacts`, which looks the label up with `detail.roles[caseItem.role]`. `detail.roles` is typed by the `Dictionary` type, and both dictionaries are `satisfies Dictionary`. There is no `switch` over `role`, so the dictionary is the only mapping.

## Goals / Non-Goals

**Goals:** accept `PRODUCT` in types, render a localized label in `ru` and `en`, keep tests and fixtures consistent with the three-value enum.

**Non-Goals:** UI changes, list changes, admin operations.

## Decisions

- **Regenerate, don't edit.** Run `pnpm api:generate` against the backend (`API_URL`); `schema.d.ts` stays generated. If the backend is unreachable, stop and report; do not hand-edit the file.
- **Typed dictionary keys.** Add `PRODUCT` to the `Dictionary` roles type so `typecheck` fails when either locale lacks it. Prefer keying the type by the `Schemas` role values so a future role breaks the build rather than rendering `undefined`.
- **Labels.** The role is a product engineer, not a product manager. The label is "Product engineer" in both ru and en: it is a fixed English job title, intentionally not translated, so the ru dictionary entry holds the English text. Wording is a product decision; cheap to change later (two strings).
- **Fixtures.** Add one `PRODUCT` case to the stub fixtures so `handler.test.ts` and E2E see all three roles. The static fallback content is changed only if a real backend case has this role.

## Risks / Trade-offs

- Backend may be unreachable when regenerating: that is a blocker, not a pass.
