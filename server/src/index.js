import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import eventsRouter from "./routes/events.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", eventsRouter);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/user_analytics";
const PORT = process.env.PORT || 4000;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const trackerDist = path.resolve(__dirname, "../../tracker/dist");
app.get("/tracker.js", (req, res) => {
  res.sendFile(path.join(trackerDist, "tracker.js"));
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
