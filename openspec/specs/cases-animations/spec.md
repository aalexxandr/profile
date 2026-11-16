# cases-animations Specification

## Purpose

Defines the entrance animations of the cases list and the case page. They use the same slide and fade motion as the home page, with blocks below the first screen animating when they scroll into view.

## Requirements

### Requirement: Case blocks enter the list

On `/ru/cases` and `/en/cases` each case block SHALL animate in with the home page entrance motion (fade with a short slide, about 0.7 s). Within a block, the picture and the case window SHALL slide in from opposite sides that match the block's alternating layout, and the window SHALL start slightly after the picture.

#### Scenario: First block on load

- **WHEN** `/en/cases` or `/ru/cases` is opened
- **THEN** the first case block animates in without any user action and ends fully opaque at its normal position

#### Scenario: Alternating sides

- **WHEN** two neighbouring case blocks animate in on a desktop viewport
- **THEN** their pictures slide in from opposite sides, and in each block the picture and the window come from opposite sides

### Requirement: Blocks below the first screen animate when scrolled into view

A block that starts below the first screen SHALL stay hidden in its entrance start state until a noticeable part of it is inside the viewport: at least a fifth of its height, or a quarter of the viewport height for a taller block. It SHALL then play its entrance animation, with its delays counting from that moment. A block already on the first screen SHALL animate on load.

#### Scenario: Scrolling the list

- **WHEN** a case block that was below the first screen is scrolled until a fifth of it is in view
- **THEN** it plays its entrance animation then, not earlier, and ends fully opaque

#### Scenario: Only the edge is in view

- **WHEN** only the top edge of a block below the first screen has been scrolled into view
- **THEN** the block stays hidden in its start state

#### Scenario: Short block at the end of the page

- **WHEN** the page is scrolled to its end
- **THEN** its last block plays its entrance animation and ends fully opaque

#### Scenario: Very tall block

- **WHEN** a block taller than the viewport is scrolled until it fills a quarter of the viewport
- **THEN** it plays its entrance animation

#### Scenario: Scrolling the case page

- **WHEN** the "Achievements" section of a case page is scrolled into view
- **THEN** the section and then its achievements, one after another, play their entrance animation

### Requirement: Entrance animations play once

Each block SHALL play its entrance animation at most once per page view. Scrolling it out of view and back SHALL NOT hide or replay it.

#### Scenario: Scrolling back up

- **WHEN** a block has animated in, is scrolled out of view and then back into view
- **THEN** it stays fully visible and does not animate again

### Requirement: Case page blocks enter

On a case page, the header SHALL animate in on load: the background fades in, and the back link, the category and name, and the facts follow with a short stagger. The "About", "Stack" and "Achievements" sections SHALL each animate in, and each achievement SHALL follow the previous one with a short stagger.

#### Scenario: Header on load

- **WHEN** `/en/cases/spectre` or `/ru/cases/spectre` is opened
- **THEN** the background, back link, category, name and facts animate in without any user action and end fully opaque at their normal positions

#### Scenario: Case without a background

- **WHEN** a case page whose case has no background picture is opened
- **THEN** the header content still animates in over the plain dark background

#### Scenario: Sections

- **WHEN** the "About", "Stack" and "Achievements" sections come into view
- **THEN** each section animates in and ends fully opaque at its normal position

### Requirement: Reduced motion shows blocks at once

When the user prefers reduced motion, every animated block on both cases pages SHALL be shown fully visible at its final position at once, with no slide and no delay, also for blocks below the first screen.

#### Scenario: Reduced motion

- **WHEN** `/en/cases` or a case page is opened with `prefers-reduced-motion: reduce`
- **THEN** every case block and section is fully opaque at its final position without waiting and without scrolling

### Requirement: Animations do not change content, layout or accessibility

The animations SHALL NOT change the final layout, content, text, links, heading structure or reading order of the cases pages. They SHALL add no focusable element and no accessible name, SHALL NOT prevent keyboard focus, and SHALL cause no console error. Blocks SHALL also be shown when the browser cannot detect visibility.

#### Scenario: Final layout unchanged

- **WHEN** all blocks have finished animating on `/en/cases` and on a case page, on a desktop and a mobile viewport
- **THEN** the picture frames keep their 520:430 ratio, the case window and section sizes are the same as without animations, the header background stays anchored to the top of the page, and nothing overflows horizontally

#### Scenario: No console errors in both locales

- **WHEN** `/ru/cases`, `/en/cases`, `/ru/cases/spectre` and `/en/cases/spectre` are loaded and scrolled to the bottom
- **THEN** no console error or uncaught page error is reported

#### Scenario: Keyboard reaches hidden blocks

- **WHEN** the user tabs to a link inside a block that has not animated in yet
- **THEN** the link receives focus, scrolls into view and its block becomes fully visible

#### Scenario: Visibility detection unavailable

- **WHEN** the browser does not support detecting when an element enters the viewport
- **THEN** every block plays its entrance animation on load and ends fully visible

### Requirement: Home page entrance animations unchanged

The home page entrance animations SHALL keep their current blocks, directions, delays and on-load timing.

#### Scenario: Home page

- **WHEN** `/en` or `/ru` is opened
- **THEN** the home scene blocks animate on load with the same directions and delays as before this change
