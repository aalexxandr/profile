# Proposal

## Why

The home page brings its blocks in with short slide and fade entrance animations (`Reveal`), while the cases list (`/[locale]/cases`) and the case page (`/[locale]/cases/[slug]`) appear all at once. That makes the cases pages feel static and unlike the rest of the site. Both cases pages scroll, so an on-load animation alone would finish off-screen for every block below the first screen. Lower blocks therefore need to animate when they scroll into view.

## What Changes

- `Reveal` (`shared/ui`) gets an opt-in trigger: `mount` (default, today's behaviour, CSS only) or `visible`. With `visible`, the entrance animation waits until the block is noticeably inside the viewport (about a fifth of the block), then plays once with the same keyframes, duration, easing and delays as on the home page. The home page keeps using the default and does not change.
- Cases list: each case block animates in. The picture and the `RetroWindow` slide in from opposite sides, matching the alternating layout. The first block animates on load. The other blocks animate when they scroll into view.
- Case page: the header pieces (back link, category, title, facts) and the background animate on load with a short stagger, like the home scene. The "About", "Stack" and "Achievements" sections animate when they scroll into view, and each achievement is staggered.
- Reduced motion (`prefers-reduced-motion: reduce`): every block is shown at once without movement, as on the home page.
- Docs: `CLAUDE.md` / `README.md` describe the `Reveal` triggers and their use on the cases pages.

## Out of scope

- Changes to the home page animations (Reveal on mount, Lottie coffee and paws, lamp, typewriter).
- New keyframes, durations or easing, and any animation library (no Framer Motion / GSAP). The existing `reveal-*` keyframes are reused.
- Exit animations, animations on route change, parallax, and hover/press effects beyond those that already exist.
- The `RetroWindow` control animations (shake, jello, zoom) and the contacts page.
- Data, layout, text and dictionary changes. No new user-facing strings are added.

## Capabilities

### New Capabilities

- `cases-animations`: entrance animations of the cases list and the case page. It covers which blocks animate, on load versus on scroll into view, plays once, reduced-motion behaviour, and that the animations do not change the layout, accessibility or content of the pages.

### Modified Capabilities

None. The content and layout requirements of `cases-catalog` and `case-details` stay as they are; the new capability states that animations must not violate them.

## Impact

- `src/shared/ui/Reveal.tsx` → `src/shared/ui/reveal/` (server `Reveal`, a client in-view part, an in-view hook and the shared class map), exported from `@/shared/ui`. Home imports move from `@/shared/ui/Reveal` to `@/shared/ui`.
- `src/views/cases/ui/CaseBlock.tsx` and `CasesPage.tsx`.
- `src/views/case-details/ui/CaseHeader/*`, `CaseAbout.tsx`, `CaseStack.tsx` and `CaseAchievements.tsx`.
- Tests: new Vitest units for `Reveal` and the in-view hook, updated slice tests, and new Playwright E2E `e2e/cases-animations.spec.ts`.
- No new dependencies. The browser `IntersectionObserver` API is used, and the block plays at once when it is missing.
