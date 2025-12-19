import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import Table from "../../components/Table";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function Sessions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/api/sessions`)
      .then((r) => r.json())
      .then((d) => setRows(d))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Layout title="Sessions">
      {loading ? (
        <div className="card">Loading sessions…</div>
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
