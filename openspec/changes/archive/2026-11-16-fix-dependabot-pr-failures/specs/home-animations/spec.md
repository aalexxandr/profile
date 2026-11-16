# Spec Delta

## Purpose

Defines the two decorative animations on the home page, the coffee cup and the cat paws, so that their behavior stays the same when the animation library is replaced by a newer major version.

## ADDED Requirements

### Requirement: Coffee cup loops

The coffee cup animation SHALL start by itself when it is shown and SHALL repeat without stopping.

#### Scenario: Shown on the home page

- **WHEN** the home page is displayed
- **THEN** the coffee cup animation is playing and loops

#### Scenario: Style from the parent

- **WHEN** the component receives a `className`
- **THEN** the animation's container has that class

### Requirement: Cat paws alternate direction

The cat paws animation SHALL start by itself, play once from start to end, then play from end to start, then forward again, alternating on every completion without a pause or a stop.

#### Scenario: First pass

- **WHEN** the home page is displayed
- **THEN** the paws animation plays forward once and does not loop on its own

#### Scenario: Completion reverses direction

- **WHEN** the paws animation completes a pass
- **THEN** it plays again in the opposite direction

#### Scenario: Alternation continues

- **WHEN** the paws animation completes several passes in a row
- **THEN** the direction alternates forward, backward, forward, and so on

### Requirement: Animations do not break the page

The animations SHALL render without console errors, SHALL be decorative (no accessible name, not focusable), and SHALL NOT change the home page layout compared with before the library upgrade.

#### Scenario: No console errors

- **WHEN** the home page `/ru` or `/en` is loaded
- **THEN** no console error or uncaught page error is reported

#### Scenario: Decorative

- **WHEN** the page is inspected by assistive technology
- **THEN** the animations expose no interactive element and no label
