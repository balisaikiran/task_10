import { z } from "zod";
import { dbConnect } from "../../lib/db";
import Event from "../../models/Event";

const eventSchema = z.object({
  session_id: z.string().min(1),
  type: z.enum(["page_view", "click"]),
  page_url: z.string().min(1),
  timestamp: z.string().transform((s) => new Date(s)),
  x: z.number().optional(),
  y: z.number().optional(),
  ua: z.string().optional()
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_event" });

  const doc = parsed.data;
  if (doc.ua == null) doc.ua = req.headers["user-agent"] || undefined;

  try {
    await dbConnect();
    await Event.create(doc);
    return res.status(201).json({ ok: true });
  } catch (e) {
    if (e && e.message === "Missing MONGODB_URI") {
      return res.status(500).json({ error: "missing_env", env: "MONGODB_URI" });
    }
    return res.status(500).json({ error: "store_failed" });
  }
}
