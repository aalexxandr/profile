# dependency-updates Specification

## Purpose

Defines how automated dependency updates are configured so that each update proposal can pass CI on its own, without hand-merging related packages or fighting toolchain versions the ecosystem cannot run yet.

## Requirements

### Requirement: Coupled packages are updated together

The Dependabot configuration SHALL group `react` and `react-dom`, so a version bump of one of them always arrives in the same pull request as the bump of the other.

#### Scenario: React release

- **WHEN** a new version of `react` and `react-dom` is published
- **THEN** one grouped pull request updates both packages to the same version

#### Scenario: Only one package has a release

- **WHEN** only one of the two packages has a newer version
- **THEN** the configuration does not produce a pull request that leaves the pair on different versions

### Requirement: Unsupported major versions are not proposed

The Dependabot configuration SHALL ignore semver-major updates of `eslint` and `typescript` until the plugins the project depends on support them, and SHALL state this reason in a comment next to the rule.

#### Scenario: New ESLint major

- **WHEN** a new major version of `eslint` is released
- **THEN** no pull request is opened for it, while minor and patch updates of `eslint` still are

#### Scenario: New TypeScript major

- **WHEN** a new major version of `typescript` is released
- **THEN** no pull request is opened for it, while minor and patch updates of `typescript` still are

### Requirement: The configuration is guarded by a test

The repository SHALL have an automated test that fails if the React group or the major-version ignore rules are removed from the Dependabot configuration.

#### Scenario: Rule removed

- **WHEN** the `react` group or an `eslint` or `typescript` ignore rule is deleted from `.github/dependabot.yml`
- **THEN** the unit test run fails and names the missing rule
