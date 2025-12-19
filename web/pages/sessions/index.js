import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div style={{ padding: 24 }}>
      <h1>Sessions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Session</th>
              <th>Total Events</th>
              <th>First</th>
              <th>Last</th>
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
        </table>
      )}
    </div>
  );
}
