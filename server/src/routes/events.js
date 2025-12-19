import { Router } from "express";
import { z } from "zod";
import Event from "../models/Event.js";

const router = Router();

const eventSchema = z.object({
  session_id: z.string().min(1),
  type: z.enum(["page_view", "click"]),
  page_url: z.string().url().or(z.string().min(1)),
  timestamp: z.string().transform((s) => new Date(s)),
  x: z.number().optional(),
  y: z.number().optional(),
  ua: z.string().optional()
});

router.post("/events", async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_event" });
  const doc = parsed.data;
  try {
    await Event.create(doc);
    return res.status(201).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "store_failed" });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    const rows = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
          first_ts: { $min: "$timestamp" },
          last_ts: { $max: "$timestamp" }
        }
      },
      { $sort: { last_ts: -1 } }
    ]);
    const out = rows.map((r) => ({
      session_id: r._id,
      total_events: r.total_events,
      first_ts: r.first_ts,
      last_ts: r.last_ts
    }));
    return res.json(out);
  } catch (e) {
    return res.status(500).json({ error: "aggregate_failed" });
  }
});

router.get("/sessions/:sessionId/events", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const events = await Event.find({ session_id: sessionId }).sort({ timestamp: 1 }).lean();
    return res.json(events);
  } catch (e) {
    return res.status(500).json({ error: "query_failed" });
  }
});

router.get("/heatmap", async (req, res) => {
  const { url, mode } = req.query;
  if (!url) return res.status(400).json({ error: "missing_url" });
  try {
    if (mode === "grid") {
      const cellSize = 50;
      const clicks = await Event.find({ page_url: url, type: "click" }, { x: 1, y: 1, timestamp: 1, _id: 0 }).lean();
      const counts = new Map();
      for (const c of clicks) {
        const cx = Math.floor((c.x || 0) / cellSize);
        const cy = Math.floor((c.y || 0) / cellSize);
        const key = `${cx}:${cy}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
      const cells = Array.from(counts.entries()).map(([k, count]) => {
        const [cx, cy] = k.split(":").map((v) => parseInt(v, 10));
        return { cellX: cx, cellY: cy, count };
      });
      return res.json({ page_url: url, cellSize, cells });
    }
    const clicks = await Event.find({ page_url: url, type: "click" }, { x: 1, y: 1, timestamp: 1, _id: 0 }).lean();
    return res.json({ page_url: url, clicks });
  } catch (e) {
    return res.status(500).json({ error: "heatmap_failed" });
  }
});

export default router;

