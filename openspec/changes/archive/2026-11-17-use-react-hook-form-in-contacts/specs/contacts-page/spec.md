# Spec Delta

## MODIFIED Requirements

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
