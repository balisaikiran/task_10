import Link from "next/link";
import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Home() {
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
    </Layout>
  );
}
