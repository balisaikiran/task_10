import { dbConnect } from "../../lib/db";
import Event from "../../models/Event";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  const { url, mode } = req.query;
  if (!url) return res.status(400).json({ error: "missing_url" });
  try {
    await dbConnect();
    if (mode === "grid") {
      const cellSize = 50;
      const clicks = await Event.find({ page_url: url, type: "click" }, { x: 1, y: 1, _id: 0 }).lean();
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
    if (e && e.message === "Missing MONGODB_URI") {
      return res.status(500).json({ error: "missing_env", env: "MONGODB_URI" });
    }
    return res.status(500).json({ error: "heatmap_failed" });
  }
}
