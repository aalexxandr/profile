# Spec Delta

## Purpose

Defines the page shown for any unknown address under a site locale: a localized 404 screen inside the site layout with a way back home, instead of the framework's default English page.

## ADDED Requirements

### Requirement: Unknown addresses show the localized 404 page

Every address under `/ru` or `/en` that matches no page, including an unknown case slug, SHALL answer with HTTP status 404 and render the 404 page in that locale inside the site layout, with the site menu and language switcher usable.

#### Scenario: Unknown Russian page

- **WHEN** `/ru/unknown-page` is requested
- **THEN** the response has status 404 and shows the Russian 404 title and description with the site menu

#### Scenario: Unknown English page

- **WHEN** `/en/unknown-page` is requested
- **THEN** the response has status 404 and shows the English 404 title and description with the site menu

#### Scenario: Unknown case slug in both locales

- **WHEN** `/ru/cases/unknown` or `/en/cases/unknown` is requested
- **THEN** the response has status 404 and shows the 404 page in the address's locale

#### Scenario: Path redirected under a locale

- **WHEN** `/de` is requested with `Accept-Language: en` and the redirect to `/en/de` is followed
- **THEN** `/en/de` answers 404 with the English 404 page

### Requirement: 404 page content

The 404 page SHALL show the decorative "404" pixel illustration, a title and a description from the dictionary of its locale, and SHALL NOT show the framework's default "This page could not be found." text.

#### Scenario: Russian texts

- **WHEN** the 404 page is shown under `/ru`
- **THEN** its title and description are the Russian dictionary texts and the illustration is hidden from assistive technology

#### Scenario: English texts

- **WHEN** the 404 page is shown under `/en`
- **THEN** its title and description are the English dictionary texts

### Requirement: 404 page leads home

The 404 page SHALL contain a keyboard-accessible link, named from the dictionary, to the home page of its locale.

#### Scenario: Back to the Russian home page

- **WHEN** the visitor activates the home link on `/ru/unknown-page`
- **THEN** the visitor is taken to `/ru`

#### Scenario: Back to the English home page

- **WHEN** the visitor activates the home link on `/en/unknown-page`
- **THEN** the visitor is taken to `/en`

### Requirement: 404 page is not indexed

The 404 page SHALL tell search engines not to index it and SHALL have a document title from the dictionary of its locale.

#### Scenario: Robots and title

- **WHEN** `/en/unknown-page` is requested
- **THEN** the HTML contains `<meta name="robots" content="noindex">` and the English 404 document title
