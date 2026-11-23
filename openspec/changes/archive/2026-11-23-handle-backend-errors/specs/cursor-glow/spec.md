# Spec Delta

## MODIFIED Requirements

### Requirement: Glow follows the pointer

On `/ru|en/cases`, `/ru|en/cases/[slug]`, `/ru|en/contacts`, the 404 page and the error screen a blurred purple circle in the hue of the site accent SHALL be shown behind the page content, fixed to the viewport. It SHALL start at the viewport centre, fade in, and move smoothly towards the pointer, lagging behind it instead of jumping.

#### Scenario: Pointer moves on the contacts page

- **WHEN** a user with a mouse moves the pointer across `/en/contacts`
- **THEN** the glow's centre approaches the pointer position and eventually settles on it

#### Scenario: Pointer moves while the page is scrolled

- **WHEN** the page content is scrolled inside its container and the pointer is then moved
- **THEN** the glow tracks the pointer's viewport position, not the content position

#### Scenario: The glow lags behind a jump of the pointer

- **WHEN** the pointer jumps a long way at once and the glow is observed after that
- **THEN** after 100 ms the glow has covered less than half of the distance, it has nearly arrived after about a second, and this holds the same on 60 Hz and 120 Hz displays

#### Scenario: Both locales

- **WHEN** `/ru/cases` and `/en/cases` are opened
- **THEN** both show the same glow

#### Scenario: Glow colour matches the accent

- **WHEN** the glow is shown on a case page
- **THEN** its colour has the hue of the site's accent (the colour of the "Back to cases" link) and is darker than the accent, so accent-coloured links stay readable over it

#### Scenario: Error pages

- **WHEN** a user with a mouse moves the pointer across `/en/unknown-page` (the 404 page) or across the error screen of a page that failed to render
- **THEN** the glow is shown behind the page content and follows the pointer as on the other pages
