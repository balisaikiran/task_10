import Link from "next/link";

export default function Layout({ title, children }) {
  return (
    <>
      <header className="layout-header">
        <div className="inner">
          <div className="brand">{title || "User Analytics"}</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/sessions">Sessions</Link>
            <Link href="/heatmap">Heatmap</Link>
            <Link href="/demo">Demo</Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
