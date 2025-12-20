import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import Table from "../../components/Table";

export default function Sessions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/sessions")
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error((data && data.error) || "request_failed");
        }
        return data;
      })
      .then((d) => setRows(d))
      .catch((e) => setError(e?.message || "request_failed"))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Layout title="Sessions">
      {loading ? (
        <div className="card">Loading sessions…</div>
      ) : error ? (
        <div className="card">Error: {error}</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Session</th>
              <th>Total Events</th>
              <th>First Activity</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.session_id}>
                <td>
                  <Link href={`/sessions/${encodeURIComponent(r.session_id)}`}>{r.session_id}</Link>
                </td>
                <td>{r.total_events}</td>
                <td>{new Date(r.first_ts).toLocaleString()}</td>
                <td>{new Date(r.last_ts).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Layout>
  );
}
