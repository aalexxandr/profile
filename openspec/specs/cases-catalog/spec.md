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

Each case block SHALL show the case name and short description and SHALL link to the case page for the same locale and slug. It SHALL NOT show an external project link, because the list data does not carry one.

#### Scenario: Link to the case page

- **WHEN** a case with slug `spectre` is shown on `/en/cases`
- **THEN** its block links to `/en/cases/spectre`

#### Scenario: No external project link

- **WHEN** a case block is shown
- **THEN** it contains no link to the external project site; that link is available only on the case page

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
