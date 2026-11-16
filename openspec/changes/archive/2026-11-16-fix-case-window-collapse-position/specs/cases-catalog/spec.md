## ADDED Requirements

### Requirement: Collapsing a case window keeps its position

On viewports where the case picture and the case window are in one row (`lg` and wider), collapsing or expanding a case window SHALL NOT move its title bar. The space of the expanded window SHALL stay reserved while it is collapsed, and the expanded window SHALL stay vertically centred next to the picture as before. On narrower viewports no space SHALL be reserved, so the page shrinks when a window is collapsed.

#### Scenario: Collapse on a wide screen

- **WHEN** the user clicks the minimize button of a case window on `/en/cases` or `/ru/cases` at a desktop viewport
- **THEN** the title bar with the minimize, maximize and close buttons keeps the same position on the page before, during and after the collapse animation, and the block does not change height

#### Scenario: Expand again

- **WHEN** a collapsed case window is expanded on a desktop viewport
- **THEN** the title bar still keeps its position and the window grows downwards

#### Scenario: Expanded layout unchanged

- **WHEN** a case window is expanded on a desktop viewport
- **THEN** it is vertically centred next to the picture

#### Scenario: Collapse on a narrow screen

- **WHEN** the user collapses a case window on a mobile viewport
- **THEN** the space below the title bar is released and the following content moves up

#### Scenario: Viewport resized

- **WHEN** the viewport is resized across a breakpoint that changes the window width and height
- **THEN** the reserved height follows the new expanded height instead of keeping the old one
