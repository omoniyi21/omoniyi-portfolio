import "./personal-effects.css";

export default function ArtifactNote({
  title,
  subtitle,
  className = "",
  rotation = "-3deg",
}) {
  return (
    <div
      className={`artifact-note ${className}`}
      style={{ "--rotation": rotation }}
    >
      <p className="artifact-note__title">{title}</p>

      {subtitle && (
        <p className="artifact-note__subtitle">{subtitle}</p>
      )}
    </div>
  );
}