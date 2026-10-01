import { Icon } from "../icons/Icon";
import PaperAction from "./PaperAction";
import "./paper-actions.css";

// The main action on a personal page, as a postage stamp: perforated pale
// lavender paper with an ink frame. It sits a little crooked on the desk
// and straightens when you reach for it.
export default function StampButton({ icon = "arrow-right", className = "", children, ...props }) {
  return (
    <PaperAction className={`stamp ${className}`.trim()} {...props}>
      <span className="stamp__paper">
        <span className="stamp__frame">
          <span className="stamp__label">{children}</span>
          <Icon name={icon} size={18} className="stamp__icon" />
        </span>
      </span>
    </PaperAction>
  );
}
