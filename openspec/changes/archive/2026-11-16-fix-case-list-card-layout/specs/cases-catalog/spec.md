## ADDED Requirements

### Requirement: Stable picture frame

Each case picture in the list SHALL be shown in a frame with a fixed 520:430 width-to-height ratio, whatever the ratio of the picture file. The picture SHALL be shown whole, scaled to fit inside the frame with its own proportions and centred, and SHALL NOT be cropped or stretched. The frame size SHALL be the same before and after the picture loads, so the case block does not change height.

#### Scenario: Picture with a different ratio

- **WHEN** a case picture whose file ratio differs from 520:430 (for example a square or a portrait picture) finishes loading on `/en/cases` or `/ru/cases`
- **THEN** its frame keeps the 520:430 ratio and the height of the case block is the same as before the picture loaded

#### Scenario: Portrait picture is shown whole

- **WHEN** a case picture is taller than the 520:430 frame
- **THEN** the picture takes the full height of the frame, is visible whole and centred, and the frame shows empty space to its left and right

#### Scenario: Wide picture is shown whole

- **WHEN** a case picture is wider than the 520:430 frame
- **THEN** the picture takes the full width of the frame, is visible whole and centred, and the frame shows empty space above and below it

#### Scenario: Same frame as the no-image text

- **WHEN** the list shows one case with a picture and one case without a picture
- **THEN** the picture frame and the "no image" box have the same 520:430 ratio

### Requirement: Short description length

Each case block SHALL show the case short description on up to 4 lines on every screen size and SHALL cut longer text with an ellipsis. The block SHALL grow with its text up to that limit instead of having a fixed height, and its "More information" link SHALL stay fully visible below the description.

#### Scenario: Long description

- **WHEN** a case whose short description needs more than 4 lines is shown on `/en/cases` or `/ru/cases`, on a desktop or a mobile viewport
- **THEN** the description takes exactly 4 lines, ends with an ellipsis, and the "More information" link is fully visible inside the case window below it

#### Scenario: Short description

- **WHEN** a case whose short description fits on one line is shown
- **THEN** the whole description is shown without an ellipsis and the "More information" link follows it directly, without empty space reserved for more lines
