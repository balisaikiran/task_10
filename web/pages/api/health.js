import { dbConnect } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  if (!process.env.MONGODB_URI) {
    return res.status(200).json({ ok: true, mongo: "missing_env" });
  }

  try {
    await dbConnect();
    return res.status(200).json({ ok: true, mongo: "connected" });
  } catch (e) {
    return res.status(200).json({ ok: true, mongo: "error" });
  }
}

