## MODIFIED Requirements

### Requirement: Case block content

Each case block SHALL show the case name and short description and SHALL link to the case page for the same locale and slug. When the case has a project link, the block SHALL link to the external project site in a new tab; when it has none, the block SHALL show a localized, non-interactive "private project" label in the place of that link.

#### Scenario: Link to the case page

- **WHEN** a case with slug `spectre` is shown on `/en/cases`
- **THEN** its block links to `/en/cases/spectre`

#### Scenario: Link to the project

- **WHEN** a case block is shown for a case that has a project link
- **THEN** it contains a link to the case's project site that opens in a new tab and has a descriptive accessible name containing the case name

#### Scenario: Case without a project link

- **WHEN** a case block is shown for a case whose project link is absent, `null`, empty or whitespace-only
- **THEN** the block contains no link to a project site, shows the label "Private project" on `/en/cases` and "Закрытый проект" on `/ru/cases`, and still links to the case page
