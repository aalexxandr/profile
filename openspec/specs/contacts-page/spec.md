# contacts-page Specification

## Purpose

Defines the contacts page `/ru|en/contacts`: how visitors reach the author through direct links and a message form, how the page is localized and how it adapts to screen sizes.

## Requirements

### Requirement: Contact links

The page SHALL show an email link (`mailto:alexxaandr.m@gmail.com`), a Telegram link (`https://t.me/alexxaandr`) and a LinkedIn link (`https://www.linkedin.com/in/alexxaandr`). It SHALL NOT show a phone number, WhatsApp or X.

#### Scenario: Links are present

- **WHEN** `/en/contacts` is opened
- **THEN** the email, Telegram and LinkedIn links are visible with the targets above

#### Scenario: Removed contacts

- **WHEN** `/en/contacts` or `/ru/contacts` is opened
- **THEN** no `tel:` link, WhatsApp link or X link exists on the page

#### Scenario: Icon links are accessible

- **WHEN** the Telegram or LinkedIn icon link is inspected
- **THEN** it has a localized accessible name, decorative icons are hidden from assistive technology, and external links open in a new tab with `rel="noopener noreferrer"`

### Requirement: Info block

The page SHALL show an illustration of a computer with the localized text "If you have a new idea to show the world, send us a message, we are always open for new collaborations" and a localized `alt` for the illustration.

#### Scenario: Text in both locales

- **WHEN** `/en/contacts` and `/ru/contacts` are opened
- **THEN** the info text and the illustration `alt` are shown in the respective language and come from the dictionaries

### Requirement: Message form fields

The page SHALL show a form titled "start work" with fields in this order: name / company, preferred method of communication, one contact field and message. The method SHALL offer exactly Telegram and Email, exactly one SHALL always be selected and Email SHALL be selected by default. The form SHALL NOT contain a service selector or a Phone option.

#### Scenario: Default form

- **WHEN** the page is opened
- **THEN** the name field, the Telegram and Email options with Email selected, the email field below them and the message field are shown, and there is no number-or-username field

#### Scenario: Removed fields

- **WHEN** the form is inspected
- **THEN** there is no service dropdown, no Phone option and no email field next to the name

### Requirement: Single contact field

Below the method the form SHALL show exactly one contact field in the same place: the email field for Email, the number-or-username field for Telegram. Switching the method SHALL replace the field in place and SHALL NOT change the form height. The form SHALL NOT contain a second contact field.

#### Scenario: Choosing Telegram

- **WHEN** the visitor selects Telegram
- **THEN** the email field is replaced in the same place by the number-or-username field and Email is no longer selected

#### Scenario: Selection cannot be cleared

- **WHEN** the visitor selects the already selected method again
- **THEN** it stays selected and the contact field does not change

#### Scenario: Form height does not change

- **WHEN** the visitor switches between Telegram and Email, or the form is cleared after a submit
- **THEN** the message field and the Send button keep their vertical positions

#### Scenario: Typed values are kept while switching

- **WHEN** the visitor types an email, selects Telegram and then selects Email again
- **THEN** the email field shows the email typed before

### Requirement: Form validation

Name, the shown contact field and message SHALL be required. For Email the contact value SHALL be a valid email address. Invalid or empty fields SHALL show a localized error message and nothing SHALL be submitted. The name and the contact fields SHALL accept at most 100 characters and the message at most 1000; the field stops at the limit, so no text beyond it can be typed or pasted.

#### Scenario: Empty submit with Email

- **WHEN** the visitor submits the empty form
- **THEN** each of name, email and message shows a localized "required" error and the success notice is not shown

#### Scenario: Empty submit with Telegram

- **WHEN** the visitor selects Telegram and submits the empty form
- **THEN** name, the number-or-username field and message show a "required" error and no email error is shown

#### Scenario: Invalid email

- **WHEN** the visitor submits with the email `abc`
- **THEN** the email field shows a localized "invalid email" error

#### Scenario: Error clears on edit

- **WHEN** a field shows an error and the visitor edits it so that the value becomes valid
- **THEN** that field's error disappears; an error stays while the value is still invalid, for example an "invalid email" error stays until the address is valid

#### Scenario: Too long input

- **WHEN** the visitor types or pastes more than 1000 characters into the message
- **THEN** only the first 1000 characters stay in the field and no error message is shown

#### Scenario: Layout and colours of the links

- **WHEN** the page is opened at any width
- **THEN** the Telegram and LinkedIn icon links are on a separate row below the email link, the email and the icons are white, and on hover and keyboard focus they turn the accent (purple) colour

### Requirement: Simulated submission

Submitting a valid form SHALL NOT send data anywhere. It SHALL clear all fields, return the method to Email, and show a localized notice that the data was sent and thanks the visitor. Submit is TEMPORARY behaviour until a real delivery channel exists.

#### Scenario: Successful submit

- **WHEN** the visitor fills name, a valid email and message and presses Send
- **THEN** no network request is made, the fields are cleared, Email is selected again and the thank-you notice is shown

### Requirement: Success notification

The notice SHALL be a popup in the bottom corner of the viewport (bottom right from `sm` up, full width at the bottom on narrow screens) above the page content. It SHALL NOT cover the site menu or move the form, SHALL be announced to assistive technology, SHALL have no close button and SHALL disappear by itself after a few seconds.

#### Scenario: Notice is a popup in the corner

- **WHEN** the thank-you notice is shown at any width
- **THEN** it is visible in the bottom part of the viewport, overlays the page without overlapping the site menu, and the form fields and the Send button keep their positions

#### Scenario: Notice disappears

- **WHEN** the thank-you notice has been visible for its display time
- **THEN** it fades out smoothly (no abrupt jump, no animation under `prefers-reduced-motion`) and is then removed from the page without any user action

#### Scenario: Notice is announced

- **WHEN** the notice appears
- **THEN** it is inside a live region (`role="status"`)

### Requirement: Localization

Every user-facing string on the page, including labels, placeholders, errors, the notice, `aria-label`s, the form title and the illustration `alt`, SHALL come from the `ru` and `en` dictionaries, and both dictionaries SHALL define the same keys.

#### Scenario: Russian page

- **WHEN** `/ru/contacts` is opened
- **THEN** all texts are in Russian and none is English, except proper names (Telegram, LinkedIn, Email)

#### Scenario: English page

- **WHEN** `/en/contacts` is opened
- **THEN** all texts are in English

### Requirement: Responsive layout

The page SHALL be usable from 320 px wide up without clipped or overlapping text and without horizontal scrolling. Below `lg` the title, links, info block and form SHALL be stacked; from `lg` the form SHALL be on the left and the info block on the right, and the title and links SHALL share the top row.

#### Scenario: Mobile

- **WHEN** the page is opened at 375 px width
- **THEN** blocks are stacked, all fields and the Send button are fully visible and the page does not scroll horizontally

#### Scenario: Desktop

- **WHEN** the page is opened at 1280 px width
- **THEN** the form and the info block are side by side

#### Scenario: Long Russian text

- **WHEN** `/ru/contacts` is opened at 320 px width
- **THEN** no label, option or button text is clipped

### Requirement: Keyboard and focus

All links, options, fields and the Send button SHALL be reachable by keyboard in visual order and show a visible focus state. Each field SHALL have a programmatically associated label, and an invalid field SHALL expose its error to assistive technology.

#### Scenario: Tab order

- **WHEN** the visitor presses Tab through the page
- **THEN** focus visits links, name, the method group (one stop, arrow keys move the selection), the contact field, message and Send in that order with a visible indicator

#### Scenario: Field error association

- **WHEN** a field shows an error
- **THEN** it has `aria-invalid="true"` and is described by its error text

### Requirement: Entrance animation

The title, info block and form SHALL appear with the shared `Reveal` animation, and everything SHALL be shown at once under `prefers-reduced-motion`. The existing cursor glow SHALL stay on the page.

#### Scenario: Reduced motion

- **WHEN** the page is opened with `prefers-reduced-motion: reduce`
- **THEN** all blocks are visible immediately
