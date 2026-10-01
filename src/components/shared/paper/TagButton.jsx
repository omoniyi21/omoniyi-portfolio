import { Icon } from "../icons/Icon";
import PaperAction from "./PaperAction";
import "./paper-actions.css";

// The second action, as a manila shipping tag on a string. It hangs from
// its hole and swings a little when you point at it.
export default function TagButton({ icon = "arrow-right", className = "", children, ...props }) {
  return (
    <PaperAction className={`tag ${className}`.trim()} {...props}>
      <svg className="tag__string" viewBox="0 0 34 30" aria-hidden="true" focusable="false">
        <path d="M33 16 C 24 17, 15 13, 9 7 S 2 1, 1 2" />
      </svg>
      <span className="tag__card">
        <span className="tag__label">{children}</span>
        <Icon name={icon} size={17} className="tag__icon" />
      </span>
    </PaperAction>
  );
}
