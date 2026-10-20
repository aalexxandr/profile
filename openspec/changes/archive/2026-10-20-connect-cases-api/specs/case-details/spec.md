# Spec Delta

## Purpose

Defines the localized single-case page: which backend fields it presents, how missing values are handled, how its metadata is produced, and which paths exist. Pages are generated statically from the backend.

## ADDED Requirements

### Requirement: Page is built from the backend

The case page for a locale and slug SHALL show the case the backend returns for that slug and locale, and SHALL NOT use locally defined case data.

#### Scenario: Existing case

- **WHEN** the page `/en/cases/spectre` is built and the backend returns that case for `en`
- **THEN** the page shows its name, description, category, stack, achievements and a link to the external project

#### Scenario: Localized text

- **WHEN** the same slug is built for `ru` and for `en`
- **THEN** each page shows the text the backend returned for its own language

### Requirement: Only backend slugs have pages

The set of generated case pages SHALL be exactly the slugs returned by the backend for each supported locale, and any other path under `/cases/` SHALL answer with a not-found page.

#### Scenario: Known slug

- **WHEN** the backend list contains `spectre`
- **THEN** `/ru/cases/spectre` and `/en/cases/spectre` exist

#### Scenario: Unknown slug

- **WHEN** a visitor opens `/en/cases/no-such-case`
- **THEN** the response is a not-found page with status 404

### Requirement: Role is shown as a localized label

The page SHALL present the case role (`FRONTEND`, `FULLSTACK`) as a label in the page's language taken from the site dictionaries, and SHALL NOT show the raw enumeration value.

#### Scenario: Frontend role in two languages

- **WHEN** a case has the role `FRONTEND`
- **THEN** the Russian page shows "Frontend-разработчик" and the English page shows "Frontend developer"

### Requirement: Project facts are shown when present

The page SHALL show the company, the team size and the project period (start and end dates formatted for the page's locale). A value that is `null` SHALL NOT be rendered together with its label, except that a missing end date SHALL read as "present" in the page's language.

#### Scenario: All facts present

- **WHEN** a case has a company, a team size, a start date and an end date
- **THEN** the page shows each of them with its label, with dates formatted for the page's locale

#### Scenario: Optional facts missing

- **WHEN** a case has `company: null` and `teamSize: null`
- **THEN** the page shows neither the company nor the team size label

#### Scenario: Ongoing project

- **WHEN** a case has `endedAt: null`
- **THEN** the period shows the start date followed by "present" in the page's language

### Requirement: Case without a picture

When a case has no picture, the page SHALL show a localized "no image" text in place of the picture and SHALL NOT request an image. When the case has a picture but no blur preview, the picture SHALL load without a blur placeholder.

#### Scenario: Missing picture

- **WHEN** the backend returns `image: null`
- **THEN** the page shows the "no image" text in the page's language and renders no `img` element for the case picture

#### Scenario: Picture without blur preview

- **WHEN** the backend returns an image URL and `blurImage: null`
- **THEN** the picture is shown without a blur placeholder

### Requirement: Case metadata

The page SHALL set its title to the case name and its description to the case short description, and SHALL declare a canonical URL for the current locale and alternate-language URLs for every locale plus `x-default`.

#### Scenario: Metadata for an English case

- **WHEN** `/en/cases/spectre` is built
- **THEN** the title is the English case name, the description is its short description, the canonical path is `/en/cases/spectre` and the alternates list `ru`, `en` and `x-default`

### Requirement: Build requires the backend

Case pages SHALL be generated at build time, and a build SHALL fail with an error when the backend cannot be reached or answers with an error other than not-found for a slug.

#### Scenario: Backend error during build

- **WHEN** the site is built and the backend answers a case request with a server error
- **THEN** the build fails and reports the request error
