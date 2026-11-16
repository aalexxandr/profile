## MODIFIED Requirements

### Requirement: Types reflect the backend contract

The generated types SHALL describe every operation and schema in the backend document, including nullable fields as `T | null`, enumerations as unions of their values, and the shared error body (`status`, `message`, `timestamp`, `path`).

#### Scenario: Nullable picture fields

- **WHEN** a case schema marks `image` and `blurImage` as nullable
- **THEN** their generated types allow `null`

#### Scenario: Role enumeration

- **WHEN** the case detail schema declares `role` as an enumeration of `FRONTEND`, `FULLSTACK` and `PRODUCT`
- **THEN** the generated type accepts only these three values
