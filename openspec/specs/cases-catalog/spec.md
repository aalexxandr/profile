# cases-catalog Specification

## Purpose

Defines the localized cases list page: where its data comes from, how each case is presented, and how cases appear in the sitemap. The list is generated statically from the backend.

## Requirements

### Requirement: List is built from the backend

The cases list page SHALL show the cases returned by the backend for the page's locale, in the order the backend returns them, and SHALL NOT use locally defined case data.

#### Scenario: Russian list

- **WHEN** the page `/ru/cases` is built
- **THEN** it shows one block per case returned by the backend for `ru`, with the Russian name and short description

#### Scenario: English list

- **WHEN** the page `/en/cases` is built
- **THEN** it shows one block per case returned by the backend for `en`

#### Scenario: Empty list

- **WHEN** the backend returns no cases
- **THEN** the page still renders with its title and no case blocks

### Requirement: Case block content

Each case block SHALL show the case name and short description, SHALL link to the case page for the same locale and slug, and SHALL link to the external project site in a new tab.

#### Scenario: Link to the case page

- **WHEN** a case with slug `spectre` is shown on `/en/cases`
- **THEN** its block links to `/en/cases/spectre`

#### Scenario: Link to the project

- **WHEN** a case block is shown
- **THEN** it contains a link to the case's project site that opens in a new tab and has a descriptive accessible name containing the case name

### Requirement: Case without a picture

When a case has no picture, its block SHALL show a localized "no image" text in place of the picture and SHALL NOT request an image.

#### Scenario: Missing picture

- **WHEN** the backend returns `image: null` for a case
- **THEN** the block shows the "no image" text in the page's language and renders no `img` element for that case

#### Scenario: Present picture

- **WHEN** the backend returns an image URL for a case
- **THEN** the block shows that picture with the case name as its alternative text

### Requirement: Build requires the backend

The list SHALL be generated at build time, and a build SHALL fail with an error when the backend cannot be reached or answers with an error, instead of producing a page with missing cases.

#### Scenario: Backend unreachable during build

- **WHEN** the site is built and the backend is unreachable
- **THEN** the build fails and reports the request error

### Requirement: Cases in the sitemap

The sitemap SHALL contain a case entry for every case slug returned by the backend, for every supported locale, each with alternate-language links and an `x-default` link.

#### Scenario: Case entries

- **WHEN** the backend returns the slug `spectre`
- **THEN** the sitemap contains `/ru/cases/spectre` and `/en/cases/spectre`, each listing both languages and `x-default` as alternates

### Requirement: Stable picture frame

Each case picture in the list SHALL be shown in a frame with a fixed 520:430 width-to-height ratio, whatever the ratio of the picture file. The picture SHALL be shown whole, scaled to fit inside the frame with its own proportions and centred, and SHALL NOT be cropped or stretched. The frame size SHALL be the same before and after the picture loads, so the case block does not change height.

#### Scenario: Picture with a different ratio

- **WHEN** a case picture whose file ratio differs from 520:430 (for example a square or a portrait picture) finishes loading on `/en/cases` or `/ru/cases`
- **THEN** its frame keeps the 520:430 ratio and the height of the case block is the same as before the picture loaded

#### Scenario: Portrait picture is shown whole

- **WHEN** a case picture is taller than the 520:430 frame
- **THEN** the picture takes the full height of the frame, is visible whole and centred, and the frame shows empty space to its left and right

#### Scenario: Wide picture is shown whole

- **WHEN** a case picture is wider than the 520:430 frame
- **THEN** the picture takes the full width of the frame, is visible whole and centred, and the frame shows empty space above and below it

#### Scenario: Same frame as the no-image text

- **WHEN** the list shows one case with a picture and one case without a picture
- **THEN** the picture frame and the "no image" box have the same 520:430 ratio

### Requirement: Short description length

Each case block SHALL show the case short description on up to 4 lines on every screen size and SHALL cut longer text with an ellipsis. The block SHALL grow with its text up to that limit instead of having a fixed height, and its "More information" link SHALL stay fully visible below the description.

#### Scenario: Long description

- **WHEN** a case whose short description needs more than 4 lines is shown on `/en/cases` or `/ru/cases`, on a desktop or a mobile viewport
- **THEN** the description takes exactly 4 lines, ends with an ellipsis, and the "More information" link is fully visible inside the case window below it

#### Scenario: Short description

- **WHEN** a case whose short description fits on one line is shown
- **THEN** the whole description is shown without an ellipsis and the "More information" link follows it directly, without empty space reserved for more lines
