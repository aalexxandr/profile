## ADDED Requirements

### Requirement: Glow reaches every part of the case page

On `/ru|en/cases/[slug]` the glow SHALL follow the pointer over the whole viewport, the case header included, with no edge or mask that hides part of it, the same way as on `/ru|en/cases` and `/ru|en/contacts`.

#### Scenario: Pointer over the header

- **WHEN** the pointer is moved over the case header (back link, name or facts) on a case page
- **THEN** the glow's centre settles on the pointer position and the glow layer has no mask

#### Scenario: Pointer near the top of the viewport after scrolling

- **WHEN** the page content is scrolled down and the pointer is moved near the top of the viewport
- **THEN** the glow's centre settles on the pointer position

#### Scenario: Both locales

- **WHEN** `/ru/cases/spectre` and `/en/cases/spectre` are opened and the pointer is moved over the header
- **THEN** on both the glow reaches the pointer over the header

## REMOVED Requirements

### Requirement: Glow stays off the case header

**Reason**: The header was kept free of the glow because it carried the case background picture. The picture is gone, so the glow may light the header like the rest of the page.
**Migration**: None for visitors. The page stops passing a boundary to the glow; the glow component no longer accepts one.
