import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Heatmap() {
  const [url, setUrl] = useState("");
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);

  const maxX = useMemo(() => (clicks.length ? Math.max(...clicks.map((c) => c.x || 0)) : 0), [clicks]);
  const maxY = useMemo(() => (clicks.length ? Math.max(...clicks.map((c) => c.y || 0)) : 0), [clicks]);

  const containerW = 800;
  const containerH = 600;
  const scaleX = maxX ? containerW / maxX : 1;
  const scaleY = maxY ? containerH / maxY : 1;

  function load() {
    if (!url) return;
    setLoading(true);
    fetch(`/api/heatmap?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => setClicks(d.clicks || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const current = typeof window !== "undefined" ? window.location.origin + "/demo" : "";
    setUrl(current);
  }, []);

  return (
    <Layout title="Heatmap">
      <Card title="Controls" subtitle="Enter a page URL and load click data">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Input label="URL" className="wide" placeholder="Page URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button variant="primary" onClick={load}>Load</Button>
          {loading && <span className="muted">Loading…</span>}
        </div>
      </Card>
      <Card title="Heatmap" subtitle={`Container ${containerW}×${containerH}, ${clicks.length} clicks`}>
        <div
          style={{
            position: "relative",
            width: containerW,
            height: containerH,
            background: "#f9f9f9",
            border: "1px solid var(--border)",
            borderRadius: 8
          }}
        >
          {clicks.map((c, i) => {
            const left = (c.x || 0) * scaleX;
            const top = (c.y || 0) * scaleY;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: 8,
                  height: 8,
                  background: "rgba(255,0,0,0.7)",
                  borderRadius: 4,
                  transform: "translate(-50%, -50%)"
                }}
                title={`${Math.round(c.x || 0)}, ${Math.round(c.y || 0)}`}
              />
            );
          })}
        </div>
        <div className="muted" style={{ marginTop: 8 }}>Tip: Use the Demo page to generate clicks.</div>
      </Card>
    </Layout>
  );
}
