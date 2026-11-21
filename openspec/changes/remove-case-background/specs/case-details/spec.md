## ADDED Requirements

### Requirement: Case page shows no picture

The case page SHALL render its header and sections on the plain page background, without any background picture and without the case picture, and SHALL NOT request a picture of the case. The header SHALL be only as tall as its content.

#### Scenario: Case with a list picture

- **WHEN** `/en/cases/spectre` or `/ru/cases/spectre` is opened for a case whose list item has a picture
- **THEN** the page contains no `img` element for the case and shows no "no image" text

#### Scenario: Header content directly on the page

- **WHEN** a case page is opened on a desktop and on a mobile viewport
- **THEN** the back link, category, name and facts are shown on the page background with no empty space reserved for a picture above "About case"

## REMOVED Requirements

### Requirement: Header shows the case background

**Reason**: The backend no longer stores or returns a background picture for a case (`backgroundImage` / `backgroundBlurImage` were removed from the contract), and the design no longer has one.
**Migration**: None for visitors; the header renders on the plain page background. Code that read the fields is removed together with them.
