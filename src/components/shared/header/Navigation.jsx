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
            <a href="/" onClick={onNavigate}>
                Home
            </a>

            <a href="/work" onClick={onNavigate}>
                Case Studies
            </a>

            <a href={resume} onClick={onNavigate} target="_blank" rel="noreferrer">
                Resume
            </a>

            <a href="/about" onClick={onNavigate}>
                Design Dossier
            </a>

            <a href="#" onClick={onNavigate}>
                Observations
            </a>

            <a href="#write-me" onClick={onNavigate}>
                Contact
            </a>

        </nav>

    );

}
