# cursor-glow Specification

## Purpose

Defines the decorative purple glow (in the hue of the site accent) that smoothly follows the mouse pointer (or stays in the viewport centre on touch screens) on the cases list, case detail and contacts pages, and the conditions under which it is shown.

## Requirements

### Requirement: Glow follows the pointer

On `/ru|en/cases`, `/ru|en/cases/[slug]` and `/ru|en/contacts` a blurred purple circle in the hue of the site accent SHALL be shown behind the page content, fixed to the viewport. It SHALL start at the viewport centre, fade in, and move smoothly towards the pointer, lagging behind it instead of jumping.

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

### Requirement: Glow is purely decorative

The glow SHALL be hidden from assistive technology, SHALL NOT receive pointer events or focus, and SHALL NOT change page text, layout or the dictionaries.

#### Scenario: Interaction with content

- **WHEN** a user clicks a link or a case window where the glow is underneath
- **THEN** the click reaches the page element and the glow does not intercept it

#### Scenario: Accessibility tree

- **WHEN** the accessibility tree of a page with the glow is inspected
- **THEN** it contains no node for the glow

### Requirement: Glow stays off the case header

On `/ru|en/cases/[slug]` nothing of the glow SHALL be drawn over the case header (the block with the case name and facts): the glow is cut at the header's bottom edge, with a short soft edge below it, and its centre SHALL NOT be above that edge. The glow SHALL still reach the content right below the header, including the "About case" block. The edge follows the header as the page scrolls and as its height changes.

#### Scenario: Pointer over the header

- **WHEN** the pointer is moved over the case header on a case page
- **THEN** the glow settles at the header's bottom edge, is visible only below it and does not appear over the header

#### Scenario: Pointer over the "About case" block

- **WHEN** the pointer is moved over the "About case" block just below the header
- **THEN** the glow follows the pointer and is visible over that block, and the part above the header's bottom edge is not visible

#### Scenario: First screen without scrolling

- **WHEN** a case page is opened at a 1280x720 viewport and the pointer is moved without scrolling
- **THEN** the glow reaches the "About case" block

#### Scenario: Header scrolls up

- **WHEN** the page is scrolled so that the header moves up
- **THEN** the edge moves up with it and the glow can reach the area the header no longer covers

#### Scenario: Case without a background image

- **WHEN** a case with no `backgroundImage` is opened
- **THEN** the same edge applies and the glow does not appear over the plain header

### Requirement: Glow mode depends on the pointer

The glow SHALL follow the pointer only when the device supports hover with a fine pointer (`(hover: hover) and (pointer: fine)`) and the user has not requested reduced motion. Without a hovering fine pointer (touch screens) the same glow SHALL be shown still, centred in the viewport, with no animation loop or pointer listeners; this also applies with reduced motion, since it does not move. With a hovering fine pointer and reduced motion no glow element SHALL be in the page.

#### Scenario: Touch device

- **WHEN** a page is opened on a touch device with a coarse pointer and no hover
- **THEN** the glow is centred in the viewport and stays there when the page is scrolled or tapped

#### Scenario: Reduced motion with a mouse

- **WHEN** a page is opened with a mouse and the reduced-motion preference on
- **THEN** no glow is rendered

#### Scenario: Preference changes while open

- **WHEN** the reduced-motion preference is turned on while the page is open with a mouse
- **THEN** the glow is removed without a reload

### Requirement: Glow stops with the page

When the page that shows the glow is left or unmounted, the glow SHALL stop its animation and remove its event listeners, and SHALL NOT keep running on pages without it (including the home page).

#### Scenario: Navigating away

- **WHEN** the user navigates from `/en/contacts` to the home page
- **THEN** no glow is present and no animation keeps running for it

#### Scenario: Pages without the glow

- **WHEN** the home page is opened
- **THEN** it contains no glow
