import { Link } from "react-router-dom";
import resume from "../../../assets/branding/Omoniyi Alimi Resume (2026)-accessibility.pdf";

export default function Navigation({ id, open, onNavigate }) {

    return (

        <nav
            id={id}
            aria-label="Primary navigation"
            aria-hidden={!open}
            inert={!open}
            className={`header-menu ${open ? "open" : ""}`}

        >
            <Link to="/" onClick={onNavigate}>
                Home
            </Link>

            <Link to="/studio" onClick={onNavigate}>
                Studio
            </Link>

            <Link to="/work" onClick={onNavigate}>
                Case Studies
            </Link>

            <Link to="/uikit" onClick={onNavigate}>
                UI Kits
            </Link>

            <a href={resume} onClick={onNavigate} target="_blank" rel="noreferrer">
                Resume
            </a>

            <Link to="/about" onClick={onNavigate}>
                Design Dossier (About Me)
            </Link>

            <Link to="/observations" onClick={onNavigate}>
                Observations (Blog)
            </Link>

            <Link to={{ pathname: "/", hash: "#contact" }} onClick={onNavigate}>
                Contact
            </Link>

        </nav>

    );

}
