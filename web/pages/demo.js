import Head from "next/head";
import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Demo() {
  return (
    <Layout title="Demo">
      <Head>
        <script src="/tracker.js" data-api="/api/events"></script>
      </Head>
      <Card title="Instructions" subtitle="This page loads the tracker; clicks generate events.">
        Click inside the area below to emit click events with coordinates.
      </Card>
      <Card title="Clickable Area">
        <div
          style={{
            width: 600,
            height: 400,
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            border: "1px solid var(--border)",
            borderRadius: 8
          }}
        >
          Clickable Area
        </div>
      </Card>
    </Layout>
  );
}
