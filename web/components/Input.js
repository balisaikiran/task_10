export default function Input({ label, className, ...props }) {
  return (
    <label className="input-row">
      {label && <span className="muted" style={{ minWidth: 80 }}>{label}</span>}
      <input className={`input ${className || ""}`} {...props} />
    </label>
  );
}
