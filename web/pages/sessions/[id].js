import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/Card";

export default function SessionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    fetch(`/api/sessions/${encodeURIComponent(id)}/events`)
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error((data && data.error) || "request_failed");
        }
        return data;
      })
      .then((d) => setEvents(d))
      .catch((e) => setError(e?.message || "request_failed"))
      .finally(() => setLoading(false));
  }, [id]);
  return (
    <Layout title={`Session ${id || ""}`}>
      {loading ? (
        <Card>Loading session…</Card>
      ) : error ? (
        <Card>Error: {error}</Card>
      ) : (
        <Card title="User Journey" subtitle="Ordered list of events">
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {events.map((e, idx) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                <span className={`badge ${e.type}`}>{e.type}</span>{" "}
                {new Date(e.timestamp).toLocaleString()}{" "}
                <strong>{e.page_url}</strong>{" "}
                {e.type === "click" ? `(${e.x}, ${e.y})` : ""}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Layout>
  );
}
