## MODIFIED Requirements

### Requirement: About case shows the description and the project link

The page SHALL have an "About case" section, titled in the page's language, that shows the case description and, when the case has a project link, a link to the external project. That link SHALL open in a new tab with `rel="noopener noreferrer"` and SHALL have an accessible name that includes the case name. When the case has no project link, the section SHALL show a localized, non-interactive "private project" label in place of the link. The section SHALL NOT show other content.

#### Scenario: Description and link

- **WHEN** a case has a description and a project link
- **THEN** the "About case" section shows the description and a link to the project

#### Scenario: Case without a project link

- **WHEN** `/en/cases/<slug>` or `/ru/cases/<slug>` is rendered for a case whose project link is absent, `null`, empty or whitespace-only
- **THEN** the "About case" section shows the description and the label ("Private project" or "Закрытый проект") in the page's language, contains no link to a project site, and the page otherwise renders normally
