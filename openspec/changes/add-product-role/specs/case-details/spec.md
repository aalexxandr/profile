## MODIFIED Requirements

### Requirement: Role is shown as a localized label

The page SHALL present the case role (`FRONTEND`, `FULLSTACK`, `PRODUCT`) as a label in the page's language taken from the site dictionaries, and SHALL NOT show the raw enumeration value.

#### Scenario: Frontend role in two languages

- **WHEN** a case has the role `FRONTEND`
- **THEN** the Russian page shows "Frontend-разработчик" and the English page shows "Frontend developer"

#### Scenario: Product role label is the same in both languages

- **WHEN** a case has the role `PRODUCT`
- **THEN** both the Russian page and the English page show "Product engineer"
