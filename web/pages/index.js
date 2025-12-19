import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>User Analytics Dashboard</h1>
      <ul>
        <li>
          <Link href="/sessions">Sessions</Link>
        </li>
        <li>
          <Link href="/heatmap">Heatmap</Link>
        </li>
        <li>
          <Link href="/demo">Demo Page</Link>
        </li>
      </ul>
    </div>
  );
}
