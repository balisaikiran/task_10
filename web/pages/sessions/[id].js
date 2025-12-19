import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function SessionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/sessions/${encodeURIComponent(id)}/events`)
      .then((r) => r.json())
      .then((d) => setEvents(d))
      .finally(() => setLoading(false));
  }, [id]);
  return (
    <div style={{ padding: 24 }}>
      <h1>Session {id}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {events.map((e, idx) => (
            <li key={idx}>
              <strong>{e.type}</strong> {new Date(e.timestamp).toLocaleString()} {e.page_url}{" "}
              {e.type === "click" ? `(${e.x}, ${e.y})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
