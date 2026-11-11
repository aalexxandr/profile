# case-details Specification

## Purpose

Defines the localized single-case page: which backend fields it presents, how missing values are handled, how its metadata is produced, and which paths exist. Pages are generated statically from the backend.

## Requirements

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

### Requirement: Header shows the case background

The page header SHALL use the case `backgroundImage` as its background, with `backgroundBlurImage` as the placeholder while it loads. When `backgroundImage` is `null` the header SHALL still render, over a plain dark background, and SHALL NOT request an image or show the "no image" text.

#### Scenario: Background with blur preview

- **WHEN** the backend returns a `backgroundImage` URL and a `backgroundBlurImage`
- **THEN** the header shows that picture as its background with the blur preview as the placeholder

#### Scenario: Background without blur preview

- **WHEN** the backend returns a `backgroundImage` URL and `backgroundBlurImage: null`
- **THEN** the background loads without a blur placeholder

#### Scenario: Case without a background

- **WHEN** the backend returns `backgroundImage: null`
- **THEN** the header renders its content over a plain dark background, renders no background `img` element and shows no "no image" text

### Requirement: Header identifies the case and leads back to the list

The header SHALL show a link back to the cases list of the current locale, the case category and the case name as the only `h1` of the page. The project facts (role, company, team size, period) SHALL be shown as a compact block of labelled facts within the header, each fact showing its label above its value and separated from the next one by a divider, following the rules of "Project facts are shown when present".

#### Scenario: Header content

- **WHEN** `/en/cases/spectre` is rendered
- **THEN** the header shows a link to `/en/cases`, the category, the name as the single `h1` and the block of facts

#### Scenario: Back link in Russian

- **WHEN** `/ru/cases/spectre` is rendered
- **THEN** the back link leads to `/ru/cases` and its text is in Russian

### Requirement: About case shows the description and the project link

The page SHALL have an "About case" section, titled in the page's language, that shows the case description and a link to the external project. The link SHALL open in a new tab with `rel="noopener noreferrer"` and SHALL have an accessible name that includes the case name. The section SHALL NOT show other content.

#### Scenario: Description and link

- **WHEN** a case has a description and a project link
- **THEN** the "About case" section shows the description and a link to the project

### Requirement: Stack is shown as a framed code card

The page SHALL show the case technologies in a "Stack" section, titled in the page's language, as a card framed with the pixel border image `code-border.png`, listing every technology of `stack` in the order the backend returned them.

#### Scenario: Stack card

- **WHEN** a case has the stack `React`, `TypeScript`
- **THEN** the "Stack" section lists `React` and `TypeScript` in that order inside the framed card

### Requirement: Achievements are shown with their result

The page SHALL show the case achievements in an "Achievements" section, titled in the page's language ("Достижения" in Russian). Each achievement SHALL show its title, then its description, then its result (the `metric`), in that order. A case without achievements SHALL NOT render the section or its title.

#### Scenario: Achievements listed

- **WHEN** a case has two achievements
- **THEN** the "Achievements" section shows, for each of them, the title, the description and the result in that order

#### Scenario: Title in two languages

- **WHEN** the page is rendered for `ru` and for `en`
- **THEN** the section title is "Достижения" and "Achievements" respectively

#### Scenario: No achievements

- **WHEN** a case has an empty `achievements` list
- **THEN** the page shows no "Achievements" title

### Requirement: Team size carries a unit that agrees with the number

The team size in the header facts SHALL be shown as the number followed by a unit in the page's language that agrees with the number, under the short label "Команда" (`ru`) or "Team" (`en`), and the team cell SHALL be the last of the facts.

#### Scenario: Russian plural forms

- **WHEN** the page is rendered for `ru` with a team size of 1, 5, 21 and 22 in turn
- **THEN** the team value reads "1 человек", "5 человек", "21 человек" and "22 человека"

#### Scenario: English plural forms

- **WHEN** the page is rendered for `en` with a team size of 1 and 6 in turn
- **THEN** the team value reads "1 person" and "6 people"

#### Scenario: Team cell is last

- **WHEN** a case shows role, period, company and team size
- **THEN** the team cell comes after the company cell

### Requirement: Period dates carry no year suffix

The project period in the header SHALL show each date as the month name and the year only, without the Russian year suffix "г.", and SHALL keep the "present" wording for an open end date.

#### Scenario: Russian period

- **WHEN** a case started `2023-03-01` and ended `2024-06-30` and the page is rendered for `ru`
- **THEN** the period reads "март 2023 – июнь 2024"

#### Scenario: English period

- **WHEN** the same case is rendered for `en`
- **THEN** the period reads "March 2023 – June 2024"

#### Scenario: Open Russian period

- **WHEN** a case has `endedAt: null` and the page is rendered for `ru`
- **THEN** the period reads the start month and year followed by "по настоящее время", without "г." after the year
