## 1. Contract

- [x] 1.1 Regenerate types with `pnpm api:generate` and confirm `role` is `"FRONTEND" | "FULLSTACK" | "PRODUCT"` in `CaseDetailDto`, `CaseFullDto`, `CreateCaseDto`, `UpdateCaseDto`

## 2. Tests first (red)

- [x] 2.1 Update `src/views/case-details/api/types.test.ts` to expect the three-value union
- [x] 2.2 Update `dictionaries.test.ts` to expect roles `FRONTEND`, `FULLSTACK`, `PRODUCT` in both locales
- [x] 2.3 Add a `CaseHeader.test.tsx` case asserting the `PRODUCT` label is exactly "Product engineer" in `ru` and `en`
- [x] 2.4 Update `scripts/stub-api/handler.test.ts` to expect all three roles from the fixtures

## 3. Implementation (green)

- [x] 3.1 Add `PRODUCT` to the `detail.roles` type and set "Product engineer" in both `ru.ts` and `en.ts`
- [x] 3.2 Add a `PRODUCT` case to `scripts/stub-api/fixtures.ts`
- [x] 3.3 Confirm no other code branches on `role` (`grep`) and that `src/shared/content/cases.ts` still type-checks

## 4. Verification

- [x] 4.1 `pnpm check`
- [ ] 4.2 `pnpm test:e2e` (stub fixtures changed)
- [ ] 4.3 Playwright MCP check of a `PRODUCT` case page on desktop and mobile viewports in `ru` and `en`: label shown, no clipping, no console errors
- [x] 4.4 Update `CLAUDE.md`/`README.md` only if they mention the role set
