## Goals
- Make the dashboard visually consistent and cleaner without adding new dependencies
- Use a shared layout, global styles, and small UI components
- Keep existing functionality intact (sessions, session detail, heatmap, demo)

## Approach
- Global styling with CSS modules and a lightweight `globals.css` reset
- Shared `Layout` with header/nav and a centered content container
- Reusable UI primitives: `Card`, `Table`, `Button`, `Input`
- Replace inline styles in pages with CSS modules

## Files to Add
- `web/pages/_app.js` to import global styles
- `web/styles/globals.css` base styles and CSS variables
- `web/components/Layout.js` app shell with header and container
- `web/components/Card.js` simple boxed section
- `web/components/Table.js` styled table component
- `web/components/Button.js` primary/secondary button styles
- `web/components/Input.js` labeled input

## Pages to Update
- `web/pages/index.js`
  - Use `Layout` and show links as `Card` tiles
- `web/pages/sessions/index.js`
  - Use `Layout` + `Table` with consistent spacing and date formatting
  - Loading state within the table area
- `web/pages/sessions/[id].js`
  - Use `Layout` + `Card` for a clean event list with type badges
- `web/pages/heatmap.js`
  - Use `Layout` + controls in a `Card` (URL input + Load button)
  - Style canvas/container with border and legend; optional grid toggle later
- `web/pages/demo.js`
  - Use `Layout` + `Card` for the clickable area with clearer instructions

## Styling Details
- Color tokens: background, text, muted, border, primary
- Spacing scale and typography sizes
- Table: zebra rows, hover state, compact cells
- Badges: type tags for `page_view` and `click`
- Responsive container widths and mobile-friendly paddings

## Accessibility
- Semantic headers and landmarks
- Button focus states and sufficient contrast
- Labels for inputs and aria attributes where relevant

## Validation
- Visual review: pages render consistently, no layout shifts
- Functionality unchanged: tracker keeps sending events; lists and heatmap load data

## Deliverables
- New components and styles
- Refactored pages using shared layout and components
- No new npm dependencies; pure CSS modules