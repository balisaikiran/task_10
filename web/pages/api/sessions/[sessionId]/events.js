import { dbConnect } from "../../../../lib/db";
import Event from "../../../../models/Event";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  const { sessionId } = req.query;
  try {
    await dbConnect();
    const events = await Event.find({ session_id: sessionId }).sort({ timestamp: 1 }).lean();
    return res.json(events);
  } catch (e) {
    if (e && e.message === "Missing MONGODB_URI") {
      return res.status(500).json({ error: "missing_env", env: "MONGODB_URI" });
    }
    return res.status(500).json({ error: "query_failed" });
  }
}
