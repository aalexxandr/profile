## ADDED Requirements

### Requirement: Case background fields are typed

The generated types SHALL describe the case background picture in the case detail as `backgroundImage` and `backgroundBlurImage`, both typed `string | null`, and SHALL NOT include them in the case list item.

#### Scenario: Nullable background fields in the detail

- **WHEN** the case detail schema marks `backgroundImage` and `backgroundBlurImage` as nullable
- **THEN** the generated `CaseDetailDto` types both fields as `string | null`

#### Scenario: List item has no background

- **WHEN** the case list item schema is generated
- **THEN** `CaseListItemDto` has no `backgroundImage` or `backgroundBlurImage` property

#### Scenario: Stub backend serves the background fields

- **WHEN** the stub backend answers a case detail request
- **THEN** the body contains `backgroundImage` and `backgroundBlurImage`, and at least one fixture case has both set to `null` and at least one has both set to strings
