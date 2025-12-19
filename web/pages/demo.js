import Head from "next/head";

export default function Demo() {
  return (
    <div style={{ padding: 24 }}>
      <Head>
        <script src="http://localhost:4000/tracker.js" data-api="http://localhost:4000/api/events"></script>
      </Head>
      <h1>Demo Page</h1>
      <p>Click anywhere to generate events.</p>
      <div
        style={{
          marginTop: 24,
          width: 600,
          height: 400,
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          border: "1px solid #ccc"
        }}
      >
        Clickable Area
      </div>
    </div>
  );
}
