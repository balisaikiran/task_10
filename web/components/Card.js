export default function Card({ title, subtitle, children, style }) {
  return (
    <section className="card" style={style}>
      {title && <h2 className="card-title">{title}</h2>}
      {subtitle && <div className="muted" style={{ marginBottom: 8 }}>{subtitle}</div>}
      {children}
    </section>
  );
}
