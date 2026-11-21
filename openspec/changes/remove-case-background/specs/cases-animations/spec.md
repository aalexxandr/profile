## MODIFIED Requirements

### Requirement: Case page blocks enter

On a case page, the header SHALL animate in on load: the back link, the category and name, and the facts enter with a short stagger. The "About", "Stack" and "Achievements" sections SHALL each animate in, and each achievement SHALL follow the previous one with a short stagger.

#### Scenario: Header on load

- **WHEN** `/en/cases/spectre` or `/ru/cases/spectre` is opened
- **THEN** the back link, category, name and facts animate in without any user action and end fully opaque at their normal positions

#### Scenario: Case without a background

- **WHEN** any case page is opened (cases no longer have a background picture)
- **THEN** the header content animates in over the plain page background and no background layer fades in

#### Scenario: Sections

- **WHEN** the "About", "Stack" and "Achievements" sections come into view
- **THEN** each section animates in and ends fully opaque at its normal position

### Requirement: Animations do not change content, layout or accessibility

The animations SHALL NOT change the final layout, content, text, links, heading structure or reading order of the cases pages. They SHALL add no focusable element and no accessible name, SHALL NOT prevent keyboard focus, and SHALL cause no console error. Blocks SHALL also be shown when the browser cannot detect visibility.

#### Scenario: Final layout unchanged

- **WHEN** all blocks have finished animating on `/en/cases` and on a case page, on a desktop and a mobile viewport
- **THEN** the picture frames keep their 520:430 ratio, the case window and section sizes are the same as without animations, and nothing overflows horizontally

#### Scenario: No console errors in both locales

- **WHEN** `/ru/cases`, `/en/cases`, `/ru/cases/spectre` and `/en/cases/spectre` are loaded and scrolled to the bottom
- **THEN** no console error or uncaught page error is reported

#### Scenario: Keyboard reaches hidden blocks

- **WHEN** the user tabs to a link inside a block that has not animated in yet
- **THEN** the link receives focus, scrolls into view and its block becomes fully visible

#### Scenario: Visibility detection unavailable

- **WHEN** the browser does not support detecting when an element enters the viewport
- **THEN** every block plays its entrance animation on load and ends fully visible
