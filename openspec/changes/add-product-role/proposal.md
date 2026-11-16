## Why

The backend added a third case role, `PRODUCT`. The `role` enumeration in `CreateCaseDto`, `UpdateCaseDto`, `CaseDetailDto` and `CaseFullDto` now has three values. The committed contract snapshot and the role label dictionaries only know `FRONTEND` and `FULLSTACK`, so a case with the new role would fail type checking and render `undefined` as its role label.

## What Changes

- Regenerate `src/shared/api/generated/schema.d.ts` from the backend `/docs-json` so `role` is `"FRONTEND" | "FULLSTACK" | "PRODUCT"`.
- Add a `PRODUCT` label to `detail.roles` in the `Dictionary` type and in both the `ru` and `en` dictionaries.
- Extend the stub backend fixtures and the static fallback content with a `PRODUCT` case where useful, so the new role is exercised end to end.
- Update tests that hardcode the two-value role set.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `case-details`: the role label requirement covers the `PRODUCT` role in both languages.
- `backend-api-contract`: the role enumeration scenario covers all three declared values.

## Impact

- `src/shared/api/generated/schema.d.ts` (regenerated, never edited by hand).
- `src/shared/i18n-server/dictionaries/{ru,en}.ts` and the `Dictionary` type.
- `scripts/stub-api/fixtures.ts`, `src/shared/content/cases.ts` (optional fixtures).
- Tests: `dictionaries.test.ts`, `types.test.ts`, `handler.test.ts`, `CaseHeader.test.tsx`.
- No code branches on `role` with a `switch`; `getCaseFacts` indexes `detail.roles[role]`, so the typed dictionary is the only mapping that must grow.

## Out of Scope

- Any UI, layout or styling change.
- Showing the role in the cases list.
- Admin or write operations (`CreateCaseDto`, `UpdateCaseDto` are only part of the regenerated types).
- Changing the backend or its role semantics.
