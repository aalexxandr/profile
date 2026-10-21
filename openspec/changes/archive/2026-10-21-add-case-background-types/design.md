## Context

The backend (`profile-back`) added `backgroundImage` / `backgroundBlurImage` to `CaseDetailDto` (absolute URL and `data:` blur URI, both nullable, independent of `image`). The list item deliberately stays compact. The running backend on `localhost:3000` already publishes the fields in `/docs-json`.

## Goals / Non-Goals

**Goals:** keep the committed contract snapshot and the typed stub fixtures in sync with the backend; lock the shape with type tests.

**Non-Goals:** any rendering of the background (see proposal, out of scope).

## Decisions

- **Regenerate, don't hand-edit.** Run `bun run api:generate`; the generated file is never edited by hand. Review the diff: only the background fields and the new background operations (`PUT` / `DELETE`, which the client does not use) should appear.
- **Fixtures typed via `Shared`.** `Shared = Omit<Detail, keyof Texts | "locale">`, so the compiler forces both new fields into every fixture case. First case gets a background URL under `cases/spectre/background/<hash>.webp` plus the blur constant; the others get `null`/`null` (one case could have a background without blur, mirroring the `image` variety). `getListItems` already maps fields explicitly, so the list stays without them.
- **Tests.**
  - Unit (type-level, `tsc` via `bun run typecheck`): `CaseDetail["backgroundImage"]` and `["backgroundBlurImage"]` equal `string | null`; `CaseListItem` has no such keys (`expectTypeOf<keyof CaseListItem>().not.toMatchTypeOf<...>` style check).
  - Unit (vitest, `scripts/stub-api/handler.test.ts`): detail bodies contain both keys, with a null and a non-null case; list items do not contain them. Nothing needs mocking; the handler is called directly.
  - No e2e: no routing or UI changes.

## Risks / Trade-offs

- `api:generate` needs the backend up; if it is unreachable the file is untouched and the task is blocked, not skipped.
- The regenerated file may carry unrelated backend changes made since the last snapshot; they are reviewed in the diff and accepted if consistent with the stub fixtures.
