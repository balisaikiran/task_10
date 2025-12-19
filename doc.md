## Overview
Build a small full‑stack app that captures `page_view` and `click` events from a lightweight JS tracker, stores them in MongoDB, and visualizes sessions and a click heatmap in a React/Next.js dashboard.

## Tech Stack
- Backend: Node.js 18+, `express`, `mongoose`
- DB: MongoDB (Atlas or local), single `events` collection + indexes
- Frontend: Next.js (React 18), minimal styling with CSS modules
- Tracker: Vanilla JS (`tracker.js`) embeddable via `<script>` tag

## Repository Structure
- `server/` Express API, Mongoose models and aggregation
- `web/` Next.js app (sessions list, session detail, heatmap)
- `tracker/` Build pipeline to output `dist/tracker.js`
- `README.md` with setup, env, and assumptions

## Data Model
- Collection: `events`
- Document shape:
  ```json
  {
    "session_id": "string",
    "type": "page_view" | "click",
    "page_url": "string",
    "timestamp": "ISO-8601",
    "x": 123,          // optional: click only
    "y": 456,          // optional: click only
    "ua": "string"    // optional: user agent
  }
  ```
- Indexes:
  - `{ session_id: 1, timestamp: 1 }` for ordered session reads
  - `{ page_url: 1, type: 1 }` to accelerate heatmap queries

## APIs (Express)
- `POST /api/events`
  - Body: event doc above; validates schema; inserts into `events`
- `GET /api/sessions`
  - Returns array of `{ session_id, total_events, first_ts, last_ts }` via aggregation
- `GET /api/sessions/:sessionId/events`
  - Returns ordered events for a session ascending by `timestamp`
- `GET /api/heatmap?url=...`
  - Returns click points: `{ page_url, clicks: [{ x, y, ts }] }`
  - Optional: aggregated grid `{ cellX, cellY, count }` when `mode=grid`
- CORS: allow requests from `web` origin; simple bearerless setup

## Tracking Script (`tracker.js`)
- On load:
  - Ensure `session_id` in `localStorage` (`analytics_session_id`); if missing, generate UUIDv4
  - Send `page_view` via `fetch` to `POST /api/events`
- On `document.addEventListener('click', ...)`:
  - Capture `event.clientX`, `event.clientY`, `location.href`, `Date.now()`
  - Send `click` event via `fetch`
- Config via `<script>` attributes:
  - `data-api` (default `"/api/events"`), `data-debug` to log locally
- Example embed:
  ```html
  <script src="/tracker/dist/tracker.js" data-api="/api/events"></script>
  ```
- Demo page: simple HTML in `web/pages/demo.tsx` that includes the script and clickable areas

## Dashboard (Next.js)
- Sessions View (`/sessions`):
  - Table: `session_id`, total events, first/last activity
  - Click row → navigate to `/sessions/[id]`
- Session Detail (`/sessions/[id]`):
  - Ordered event list with type, time, page_url, and click coordinates
- Heatmap View (`/heatmap`):
  - Input/select `page_url`
  - Render a container with overlaid dots for click positions
  - Optional toggle to show grid density (`mode=grid`) with colored cells

## Heatmap Rendering
- Raw points:
  - Normalize coordinates into container size by computing scale from max `x/y`
  - Draw small circles using absolutely positioned divs or canvas
- Grid mode:
  - Bucket clicks by `cellSize` (e.g., 50px); color intensity maps to count

## Environment & Setup
- Env vars: `MONGODB_URI`, `PORT` (server), `NEXT_PUBLIC_API_BASE`
- Dev: run MongoDB locally (`mongodb-community`) or Atlas
- Scripts:
  - `server`: `npm run dev` (nodemon), `npm run start`
  - `web`: `npm run dev`, `npm run build && npm run start`
  - `tracker`: `npm run build` outputs `dist/tracker.js`

## Testing & Validation
- Manual flows:
  - Open demo page; verify `page_view` stored
  - Click around; verify `click` events stored and displayed in session detail
  - Heatmap view shows dots aligned within container
- Basic unit tests:
  - API schema validation for `POST /api/events`
  - Aggregation correctness for `GET /api/sessions`

## Assumptions & Trade-offs
- Sessions derived from events; no separate sessions collection
- Click coordinates use `clientX/clientY` (viewport), not full document scroll offsets; acceptable for demo
- Heatmap uses relative scaling, not actual DOM snapshot; keeps implementation simple
- Minimal auth and rate limiting (could add later)

## Next Steps
1. Scaffold `server`, `web`, `tracker` directories
2. Implement `events` model and API endpoints
3. Build `tracker.js` with page_view and click sending
4. Create demo page and dashboard views
5. Add indexes, minimal validation, and README
