# Spec Delta

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Case without a picture

**Reason**: The case page no longer shows the case picture; its visual is the header background (see "Header shows the case background"). The picture and its blur preview stay in the cases list, which is covered by `cases-catalog`.

**Migration**: None for visitors. The page SHALL NOT render or request `image` / `blurImage`, and shows no "no image" text.
