import "./personal-effects.css";

export default function PaperCard({
  children,
  className = "",
  label,
  variant,
}) {
  return (
    <article className={`paper-card paper-card--${variant} ${className}`} aria-label={label}>
      {children}
    </article>
  );
}
