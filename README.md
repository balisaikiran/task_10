# User Analytics Application


## Objective
- Track `page_view` and `click` events with a lightweight JS tracker
- Store events in MongoDB via API endpoints
- Visualize sessions and a click heatmap in a Next.js dashboard

## Tech Stack
- Backend: Next.js API Routes, Mongoose, Zod
- Database: MongoDB (Atlas or local)
- Frontend: Next.js (React)
- Tracker: Vanilla JS (served from `web/public/tracker.js`)

## Repository Structure
- `server/` Express API and Mongoose models
- `web/` Next.js dashboard and demo page
- `tracker/` Tracker source and build script

## Setup
1. Prerequisites: Node.js 18+, MongoDB (local or Atlas URI)
2. Install dependencies:
   - `cd web && npm install`
3. Configure environment:
   - In `web`, set `MONGODB_URI` (Atlas or local)
4. Run:
   - `cd web && npm run dev` (http://localhost:3000)

## APIs
- `POST /api/events` receive and store events
- `GET /api/sessions` list sessions with event counts
- `GET /api/sessions/:sessionId/events` ordered events for a session
- `GET /api/heatmap?url=...` click positions for a page; `mode=grid` returns aggregated cells

## Tracker Usage
- Embed on any page:
  - `<script src="/tracker.js" data-api="/api/events"></script>`
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
- Set `MONGODB_URI` in your environment (Vercel project settings)
- Consider adding input schema validation errors detail and request logging

## Deploy to Vercel
1. Push this repository to GitHub.
2. In Vercel, click “New Project” and import the repo.
3. Set the Root Directory to `web`.
4. In Vercel → Project Settings → Environment Variables, add:
   - `MONGODB_URI` = your MongoDB Atlas connection string (include a DB name, e.g. `/user_analytics`)
5. Deploy.

After deploy:
- Dashboard: `https://<your-app>.vercel.app/`
- Demo page (generates events): `https://<your-app>.vercel.app/demo`
- Tracker script: `https://<your-app>.vercel.app/tracker.js`
