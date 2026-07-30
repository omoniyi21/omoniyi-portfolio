import "./button.css";

export default function Button({
  children,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      disabled={disabled}
      type={type}
      {...props}
    >
      <span className="button__label">
        {children}
      </span>

      <span
        className="button__texture"
        aria-hidden="true"
      />
    </button>
  );
}