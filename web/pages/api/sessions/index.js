import { dbConnect } from "../../../lib/db";
import Event from "../../../models/Event";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  try {
    await dbConnect();
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
    if (e && e.message === "Missing MONGODB_URI") {
      return res.status(500).json({ error: "missing_env", env: "MONGODB_URI" });
    }
    return res.status(500).json({ error: "aggregate_failed" });
  }
}
