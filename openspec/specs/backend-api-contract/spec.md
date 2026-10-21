# backend-api-contract Specification

## Purpose

Keeps the frontend's knowledge of the backend API in sync with the backend's published OpenAPI contract, and gives Server Components a typed, read-only way to load cases.

## Requirements

### Requirement: Types are regenerated from the backend

The system SHALL provide a command that reads the OpenAPI document from the backend's `/docs-json` address and writes the TypeScript types for it to a single committed file, which serves as the snapshot of the contract.

#### Scenario: Backend reachable

- **WHEN** the generate command runs and the backend answers with a valid OpenAPI document
- **THEN** the committed types file is updated to match it

#### Scenario: Backend unreachable or invalid

- **WHEN** the generate command runs and the backend is unreachable, answers with an error status, or returns a body that is not an OpenAPI document
- **THEN** the command exits with a non-zero status and a readable message, and the existing types file is left unchanged

#### Scenario: Repeated run without backend changes

- **WHEN** the generate command runs twice against an unchanged backend
- **THEN** the second run produces no file differences

### Requirement: Types reflect the backend contract

The generated types SHALL describe every operation and schema in the backend document, including nullable fields as `T | null`, enumerations as unions of their values, and the shared error body (`status`, `message`, `timestamp`, `path`).

#### Scenario: Nullable picture fields

- **WHEN** a case schema marks `image` and `blurImage` as nullable
- **THEN** their generated types allow `null`

#### Scenario: Role enumeration

- **WHEN** the case detail schema declares `role` as an enumeration
- **THEN** the generated type accepts only the declared values

### Requirement: Cases are read through a typed client

The system SHALL provide a client that loads the list of cases and a single case by slug, passing the requested locale as the `lang` query parameter and returning data typed from the generated contract.

#### Scenario: List cases

- **WHEN** the list is requested for a locale
- **THEN** a request is sent to the backend cases list endpoint with `lang` set to that locale and the typed list is returned

#### Scenario: Single case

- **WHEN** a case is requested by slug and locale
- **THEN** a request is sent to the backend case endpoint for that slug with `lang` set to that locale and the typed case is returned

### Requirement: Client reports failures explicitly

The client SHALL raise an error when the backend answers with an error status, carrying the status and message from the backend error body when present, and SHALL raise an error naming the missing setting when the backend base URL is not configured.

#### Scenario: Case not found

- **WHEN** the backend answers 404 for a slug
- **THEN** the client raises an error that exposes the 404 status and the backend message

#### Scenario: Base URL missing

- **WHEN** a client call is made and the backend base URL is not configured
- **THEN** the client raises an error that names the missing setting instead of sending a request

### Requirement: Client is read-only and server-side

The client SHALL expose only read operations, SHALL NOT send credentials, and SHALL read the backend address from a server-only setting that is not exposed to the browser bundle.

#### Scenario: No write operations

- **WHEN** the public interface of the client and of the case requests is inspected
- **THEN** it offers only read (GET) operations and no create, update, delete or image-upload operations

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
