import SpaceSwitcher from "../SpaceSwitcher";
import { Link } from "react-router-dom";

export default function Navigation({ id, open, onNavigate }) {

    return (

        <nav
            id={id}
            aria-label="Primary navigation"
            aria-hidden={!open}
            inert={!open}
            className={`portfolio-menu-panel ${open ? "open" : ""}`}

        >
            <Link to="/" onClick={onNavigate}>
                Home
            </Link>



            <Link to="/work" onClick={onNavigate}>
                Case Studies
            </Link>



            <Link to="/resume" onClick={onNavigate}>
                Resume
            </Link>

            <Link to="/about" onClick={onNavigate}>
                Design Dossier (About)
            </Link>

            <Link to="/observations" onClick={onNavigate}>
                Observations (Blog)
            </Link>

            <Link to={{ pathname: "/", hash: "#contact" }} onClick={onNavigate}>
                Contact
            </Link>

            <SpaceSwitcher space="portfolio" onNavigate={onNavigate} />
        </nav>

    );

}
