import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

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
    fetch(`${API_BASE}/api/heatmap?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => setClicks(d.clicks || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const current = typeof window !== "undefined" ? window.location.origin + "/demo" : "";
    setUrl(current);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Heatmap</h1>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Page URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: 480, padding: 8 }}
        />
        <button onClick={load} style={{ marginLeft: 8, padding: "8px 12px" }}>
          Load
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div
        style={{
          position: "relative",
          width: containerW,
          height: containerH,
          background: "#f9f9f9",
          border: "1px solid #ddd"
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
    </div>
  );
}
