import { Link } from "react-router-dom";
import BrandSignature from "../shared/BrandSignature";
import SpaceSwitcher from "../shared/SpaceSwitcher";
import Button from "../shared/button/Button";

// The Studio's own navigation, shared by the Studio page and the About
// manifesto. `current` marks the page you're on.
const NAV_LINKS = [
  { id: "work", label: "Work", to: "/work" },
  { id: "studio", label: "Studio", to: "/studio" },
  { id: "admission", label: "Admission", to: "/studio/admission" },
  { id: "launchkit", label: "LaunchKit", to: "/studio#launchkit" },
  { id: "blog", label: "Blog", to: "/observations" },
  { id: "about", label: "About", to: "/studio/about" },
];

export default function StudioNav({ current }) {
  return (
    <nav className="studio-nav" aria-label="Studio navigation">
      <div className="ecosystem-lockup"><BrandSignature space="studio" /><SpaceSwitcher space="studio" /></div>

      <div className="studio-nav__links">
        {NAV_LINKS.map(({ id, label, to }) => (
          <Link
            key={id}
            to={to}
            className={current === id ? "is-active" : ""}
            aria-current={current === id ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      <Button to="/studio/inquire" variant="primary" className="studio-nav__cta">
        Tell me what isn’t working
      </Button>
    </nav>
  );
}
