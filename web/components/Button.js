export default function Button({ children, variant = "default", ...props }) {
  const cls = `btn ${variant === "primary" ? "primary" : ""}`;
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
