## ADDED Requirements

### Requirement: Project link is nullable in the typed contract

The generated types SHALL describe the case `projectLink` of the list item and of the case detail as nullable (`string | null`), as the backend does, so that code reading it has to handle a case without a link. The stub backend fixtures and the static fallback content SHALL be able to describe a case with `projectLink: null`, and the stub SHALL serve at least one such case.

#### Scenario: Reading a case without a link

- **WHEN** code reads `projectLink` of a `CaseListItemDto` or `CaseDetailDto`
- **THEN** the type permits `null`, and a typecheck fails if the value is used as a plain `string` without handling that

#### Scenario: Stub serves a case without a link

- **WHEN** the stub backend lists cases
- **THEN** at least one returned case has no project link
