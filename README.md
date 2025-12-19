# User Analytics Application

## Objective
- Track `page_view` and `click` events with a lightweight JS tracker
- Store events in MongoDB via a Node.js API
- Visualize sessions and a click heatmap in a Next.js dashboard

## Tech Stack
- Backend: Node.js, Express, Mongoose, Zod
- Database: MongoDB (Atlas or local)
- Frontend: Next.js (React)
- Tracker: Vanilla JS bundled with esbuild

## Repository Structure
- `server/` Express API and Mongoose models
- `web/` Next.js dashboard and demo page
- `tracker/` Tracker source and build script

## Setup
1. Prerequisites: Node.js 18+, MongoDB (local or Atlas URI)
2. Install dependencies:
   - `cd server && npm install`
   - `cd ../tracker && npm install`
   - `cd ../web && npm install`
3. Configure environment:
   - In `server`, create `.env` with `MONGODB_URI` and optional `PORT`
   - In `web`, optionally set `NEXT_PUBLIC_API_BASE` (defaults to `http://localhost:4000`)
4. Build tracker:
   - `cd tracker && npm run build`
5. Run servers:
   - API: `cd server && npm run dev` (http://localhost:4000)
   - Web: `cd web && npm run dev` (http://localhost:3000)

## APIs
- `POST /api/events` receive and store events
- `GET /api/sessions` list sessions with event counts
- `GET /api/sessions/:sessionId/events` ordered events for a session
- `GET /api/heatmap?url=...` click positions for a page; `mode=grid` returns aggregated cells

## Tracker Usage
- Embed on any page:
  - `<script src="http://localhost:4000/tracker.js" data-api="http://localhost:4000/api/events"></script>`
- Automatically sends `page_view` on load and `click` on user clicks
- Uses `localStorage` key `analytics_session_id` for session persistence

## Dashboard
- Sessions: list, counts, first/last timestamps
- Session Detail: ordered journey, click coordinates
- Heatmap: input page URL and render click dots in a scaled container
- Demo Page: `/demo` shows a clickable area with the tracker embedded

## Assumptions and Trade-offs
- Sessions derived from events, no separate sessions collection
- Click coordinates use viewport `clientX/clientY` for simplicity
- Heatmap scales relative to observed max coordinates without DOM snapshot
- Minimal auth and rate limiting, suitable for a candidate assignment

## Production Notes
- Serve `tracker.js` via the API server or a CDN
- Enable CORS appropriately
- Use MongoDB Atlas and set `MONGODB_URI` in environment
- Consider adding input schema validation errors detail and request logging

