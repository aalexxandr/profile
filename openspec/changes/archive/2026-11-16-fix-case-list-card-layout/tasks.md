# Tasks

## 1. Preparation

- [x] 1.1 Invoke the `ui-ux-pro-max` skill for the case list card (fixed picture frame, auto-height window, 4-line description) and note any adjustment it suggests to the design; verify by recording the outcome in this change before editing components
- [x] 1.2 In `scripts/stub-api/fixtures.ts` make the `orbit` short description long enough to exceed 4 lines at the widest card (about 400+ characters, ru and en); verify `pnpm test scripts/stub-api` still passes

## 2. Stable picture frame

- [x] 2.1 (red) In `src/shared/ui/ImageWithFallback.test.tsx` forward `className` through the `next/image` mock and add a test that the picture has `aspect-520/430`, `object-cover` and `object-top`, and that the fallback keeps `aspect-520/430`; verify the picture assertions fail
- [x] 2.2 (red) In `e2e/cases.spec.ts` add a test for both locales: after the first case picture has loaded (`complete`; the mobile project reports `naturalWidth` 0 for the stub pixel), its rendered height equals `width * 430 / 520` within 1px; verify it fails on desktop and mobile with `pnpm test:e2e e2e/cases.spec.ts` (the stub image is 1x1, so the picture is square today)
- [x] 2.3 (green) Add `aspect-520/430 object-cover object-top` to the picture branch of `src/shared/ui/ImageWithFallback.tsx`, keeping `width`/`height` props and the `CaseBlock` width classes; verify tests 2.1 and 2.2 pass

## 3. Short description length

- [x] 3.1 (red) In `src/views/cases/ui/CaseBlock.test.tsx` add tests that the description has `line-clamp-4` and no other `line-clamp-*` class (including `xl:`), and that the content wrapper has no fixed `h-*` / `sm:h-*` class; verify they fail
- [x] 3.2 (red) In `e2e/cases.spec.ts` add a test for both locales: the `orbit` description renders exactly 4 lines (height = 4 x computed line-height) and its "More information" link lies fully inside its case window; the `spectre` description is not clipped and its card content ends at the bottom of its "More information" button (no space reserved below); verify it fails on desktop and mobile
- [x] 3.3 (green) In `src/views/cases/ui/CaseBlock.tsx` remove `h-73 sm:h-50` from the content wrapper and replace `line-clamp-3 ... xl:line-clamp-2` with `line-clamp-4`; verify tests 3.1 and 3.2 pass

## 4. Verification

- [x] 4.1 Playwright MCP check of `/ru/cases` and `/en/cases` on desktop (1440px) and mobile (390px), plus `sm`/`md`/`lg` widths: no block height change while pictures load (throttled network), pictures cropped from the bottom, descriptions up to 4 lines with an ellipsis, no clipped or overlapping text, button focus/hover states intact, no console errors
- [x] 4.2 Run `pnpm check` and verify it passes
- [x] 4.3 Run `pnpm test:e2e` and verify every test passes on desktop and mobile projects

## 5. Show the whole picture

- [x] 5.1 (red) In `src/shared/ui/ImageWithFallback.test.tsx` change the frame test: the picture has `aspect-520/430` and `object-contain` and has neither `object-cover` nor `object-top`; verify it fails
- [x] 5.2 (green) In `src/shared/ui/ImageWithFallback.tsx` replace `object-cover object-top` with `object-contain`; verify 5.1 and the e2e frame test pass
- [x] 5.3 Playwright MCP check of `/ru/cases` and `/en/cases` on desktop and mobile with a real portrait picture: the picture is whole, not stretched, centred, the block height does not change on load, no console errors
- [x] 5.4 Run `pnpm check` and `pnpm test:e2e` and verify both pass
