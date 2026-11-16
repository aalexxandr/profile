# Proposal

## Why

On the cases list (`/ru/cases`, `/en/cases`) the block around a case picture changes height once the picture loads: the space is reserved with a fixed 520:430 ratio, but the browser then switches to the picture's own ratio (for `spectre` it is 1100:1230), so the content below it jumps. The backend accepts pictures of any ratio, so every case can jump by a different amount. Separately, the short description is cut to 2 lines on wide screens (3 on narrow ones), which hides most of the text, and the card window has a fixed height that leaves no room for more.

## What Changes

- The case picture in the list is always shown in one fixed frame with a 520:430 ratio (the same ratio as the "no image" placeholder). The picture is shown whole, in its own proportions, scaled down to fit and centred in the frame; it is never cropped or stretched, so a picture whose ratio differs from the frame leaves empty space at its sides or above and below it. The frame size does not depend on the picture, so the block height no longer changes when the picture loads.
- The short description in the list shows up to 4 lines on every screen size; longer text is cut with an ellipsis.
- The card window no longer has a fixed height: it grows with its content (up to the 4-line description) instead of reserving the same space for every case.
- The stub backend gets a long short description for one case so the 4-line limit can be checked end to end.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cases-catalog`: adds requirements for a stable picture frame (no layout shift when the picture loads) and for the short description length (up to 4 lines, card height follows the text).

## Impact

- Code: `src/views/cases/ui/CaseBlock.tsx` (description clamp, card content height), `src/shared/ui/ImageWithFallback.tsx` (fixed frame for the picture), their unit tests, `e2e/cases.spec.ts`, and the stub fixtures in `scripts/stub-api/fixtures.ts`.
- No API, dependency, routing or dictionary changes; no new user-facing text.

## Out of scope

- Showing pictures in their natural ratio (reading sizes from the blur preview, from the storage or from new backend fields): rejected in favour of one fixed frame.
- Filling the empty space around a picture of a different ratio (a background, border or blurred copy).
- Appear animations on the cases list or the case page: they do not prevent the layout shift and are a separate change.
- The case page (`/cases/[slug]`) and its header background: not affected.
- Changes to the backend or its OpenAPI contract.
