## ADDED Requirements

### Requirement: Contract has no case background

The generated types SHALL NOT describe a case background picture: neither the case detail nor the case list item SHALL have `backgroundImage` or `backgroundBlurImage`. The stub backend and the static fallback data SHALL NOT return them.

#### Scenario: Types regenerated from the backend

- **WHEN** the types are generated from a backend whose OpenAPI document has no background fields
- **THEN** neither `CaseDetailDto` nor `CaseListItemDto` has a `backgroundImage` or `backgroundBlurImage` property

#### Scenario: Stub backend answers a case detail

- **WHEN** the stub backend answers a case detail request for any fixture case
- **THEN** the body contains no `backgroundImage` or `backgroundBlurImage` property

## REMOVED Requirements

### Requirement: Case background fields are typed

**Reason**: The backend removed the case background (`backgroundImage`, `backgroundBlurImage` and the `/cases/{slug}/background` routes) from its OpenAPI contract.
**Migration**: Regenerate the types with `pnpm api:generate` against the updated backend; drop the fields from the stub fixtures and the static fallback data.
