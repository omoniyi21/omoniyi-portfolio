import { Link } from "react-router-dom";
import resume from "../../../assets/branding/Omoniyi Alimi Resume (2026).pdf";

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

            <Link to="/work" onClick={onNavigate}>
                Case Studies
            </Link>

            <a href={resume} onClick={onNavigate} target="_blank" rel="noreferrer">
                Resume
            </a>

            <Link to="/about" onClick={onNavigate}>
                Design Dossier
            </Link>

            <Link to="/observations" onClick={onNavigate}>
                Observations
            </Link>

            <Link to="/#contact" onClick={onNavigate}>
                Contact
            </Link>

        </nav>

    );

}
