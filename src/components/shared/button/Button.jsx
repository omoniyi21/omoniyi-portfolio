import clsx from "clsx";
import { Icon } from "../icons/Icon";
import { Link } from "react-router-dom";
import "./button.css";

// The site's one arrow rule: right for pages here, up-right for other sites.
const arrowFor = (to, href) => (/^https?:/.test(href || to || "") ? "arrow-up-right" : "arrow-right");

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  icon = true, // true for the default arrow, an icon name, or false
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
          <Icon
            name={typeof icon === "string" ? icon : arrowFor(to, href)}
            size={18}
            strokeWidth={1.5}
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
