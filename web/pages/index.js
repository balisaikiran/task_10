import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Home() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHealth(d))
      .catch(() => setHealthError("Unable to reach API routes"));
  }, []);

  return (
    <Layout title="User Analytics">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <Card title="Sessions" subtitle="Explore sessions and counts">
          <Link href="/sessions" className="btn primary">Open Sessions</Link>
        </Card>
        <Card title="Heatmap" subtitle="Visualize clicks on a page">
          <Link href="/heatmap" className="btn primary">Open Heatmap</Link>
        </Card>
        <Card title="Demo Page" subtitle="Generate events by clicking">
          <Link href="/demo" className="btn primary">Open Demo</Link>
        </Card>
      </div>
      <div style={{ marginTop: 16 }}>
        <Card title="Backend Status" subtitle="Vercel API + MongoDB connectivity">
          {healthError ? (
            <div className="muted">{healthError}</div>
          ) : health ? (
            <div>
              <div className="muted">API: {health.ok ? "ok" : "error"}</div>
              <div className="muted">MongoDB: {health.mongo}</div>
              {health.mongo === "missing_env" && (
                <div className="muted" style={{ marginTop: 8 }}>
                  Set <strong>MONGODB_URI</strong> in Vercel → Project → Settings → Environment Variables.
                </div>
              )}
            </div>
          ) : (
            <div className="muted">Checking…</div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
