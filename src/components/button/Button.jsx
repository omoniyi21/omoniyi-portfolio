import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import "./button.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  icon = true,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
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
      )}
      {...props}
    >
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
    </button>
  );
}
