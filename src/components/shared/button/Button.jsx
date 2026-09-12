import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./button.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  icon = true,
  className,
  to,
  href,
  ...props
}) {
  const buttonClassName = clsx(
        "button",
        "surface--stroke",
        {
            "button--primary surface--celestial":
                variant === "primary",

            "button--secondary":
                variant === "secondary",

            "button--ghost":
                variant === "ghost",
        },
        className
      );

  const content = (
      <span className="button__content">
        <span className="button__label">{children}</span>

        {icon && (
          <ArrowUpRight
            size={18}
            strokeWidth={2}
            className="button__icon"
          />
        )}
      </span>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClassName} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClassName} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassName}
      {...props}
    >
      {content}
    </button>
  );
}
