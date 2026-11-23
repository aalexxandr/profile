# page-error-recovery Specification

## Purpose

Defines what a visitor sees when a localized page fails to render (backend error, unreachable backend, component bug): a recoverable, localized error screen inside the site layout instead of a crashed site.

## Requirements

### Requirement: Failed page shows a localized error screen inside the site layout

When rendering a page under a locale throws an uncaught error, the site SHALL replace only that page's content with the error screen (the decorative "500" pixel illustration, a title and a description in the page's locale), and SHALL keep the site menu and language switcher rendered and usable.

#### Scenario: Backend server error on the Russian cases list

- **WHEN** `/ru/cases` is rendered and the backend answers the cases request with status 500
- **THEN** the page content shows the error illustration and the Russian title and description, and the site menu is still shown

#### Scenario: Backend unreachable on the English cases list

- **WHEN** `/en/cases` is rendered and the request to the backend fails with a network error
- **THEN** the page content shows the error illustration and the English title and description, and the site menu is still shown

#### Scenario: Navigating away from a failed page

- **WHEN** the error screen is shown and the visitor follows a site menu link to another page
- **THEN** the other page renders normally without the error screen

### Requirement: Error screen offers a retry

The error screen SHALL contain a keyboard-accessible "try again" button, named from the dictionary, that re-renders the failed page in place without a full page reload.

#### Scenario: Retry after the backend recovers

- **WHEN** the error screen is shown for a backend error, the backend then answers successfully, and the visitor activates "try again"
- **THEN** the page content is rendered normally and the error screen disappears

#### Scenario: Retry while the backend is still failing

- **WHEN** the visitor activates "try again" and the page fails again
- **THEN** the error screen is shown again and the button stays available

### Requirement: Error screen links to the home page

The error screen SHALL contain a link, named from the dictionary, to the home page of the current locale.

#### Scenario: Back to the Russian home page

- **WHEN** the error screen is shown on a `/ru` page and the visitor activates the home link
- **THEN** the visitor is taken to `/ru`

#### Scenario: Back to the English home page

- **WHEN** the error screen is shown on an `/en` page and the visitor activates the home link
- **THEN** the visitor is taken to `/en`

### Requirement: Error screen hides error details

The error screen SHALL NOT display the error message, status code from the backend, stack trace or backend response to the visitor; the error SHALL be reported to the browser console for diagnosis.

#### Scenario: Backend error message is not shown

- **WHEN** the backend answers with status 500 and message "Internal server error"
- **THEN** the error screen shows only the dictionary texts, and the message appears in the console log instead of the page

### Requirement: Not-found is not treated as a failure

A page that signals "not found" (for example an unknown case slug) SHALL render the 404 page with HTTP status 404 and SHALL NOT show the error screen.

#### Scenario: Unknown case slug

- **WHEN** `/ru/cases/unknown-slug` is requested
- **THEN** the response has status 404 and shows the 404 page, not the error screen
