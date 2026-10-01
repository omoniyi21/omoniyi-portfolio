import { Icon } from "../icons/Icon";
import PaperAction from "./PaperAction";
import "./paper-actions.css";

// A handwritten link, the same hand as the margin notes. A faint pencil
// line rests under it and an ink line draws over it when you point at it.
// Arrows: right for pages on this site, up-right for other sites.
export default function PenLink({ className = "", children, ...props }) {
  const icon = props.href ? "arrow-up-right" : "arrow-right";
  return (
    <PaperAction className={`pen-link ${className}`.trim()} {...props}>
      <span className="pen-link__text">
        {children}
        <svg className="pen-link__line" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="pen-link__pencil" d="M1 3.6 C 20 2.2, 38 4.6, 56 3.2 S 86 2.4, 99 3.4" />
          <path className="pen-link__ink" d="M1 3.6 C 20 2.2, 38 4.6, 56 3.2 S 86 2.4, 99 3.4" />
        </svg>
      </span>
      <Icon name={icon} size={18} strokeWidth={1.5} className="pen-link__icon" />
    </PaperAction>
  );
}
