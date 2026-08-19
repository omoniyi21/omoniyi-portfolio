import "./selected-work.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ArrowUpRight,
    CirclePlus,
    Grid2X2,
    Landmark,
    LibraryBig,
} from "lucide-react";

const featuredProjects = [
    {
        client: "U.S. House",
        title: "Digital services",
        description: "Making public digital services easier to understand. Designing clear pathways for people to act with confidence.",
        category: "Government",
        href: "/house",
        icon: Landmark,
    },
    {
        client: "USDA",
        title: "Data systems",
        description: "Turning complex information into tools people can use. Structure, accessibility, and clarity at scale.",
        category: "Government",
        href: "/usda",
        icon: Grid2X2,
    },
    {
        client: "Athletico",
        title: "Care journeys",
        description: "Creating more human healthcare experiences. Supporting patients across meaningful moments of care.",
        category: "Healthcare",
        href: "/athletico",
        icon: CirclePlus,
    },
    {
        client: "Library of Congress",
        title: "Enterprise systems",
        description: "Modernizing systems that support discovery. Making knowledge easier to navigate and share.",
        category: "Government",
        href: "/library-of-congress",
        icon: LibraryBig,
    },
    {
        client: "Movie Club <3",
        title: "A Third Space",
        description: "Creating a place for people to gather around the films they love.",
        category: "Hobbies",
        href: "/work",
        icon: CirclePlus,
    },
];

export default function HeroProjects({ projects = featuredProjects }) {
    const railRef = useRef(null);
    const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
    const suppressClick = useRef(false);

    const handlePointerDown = (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        // A mouse press on a card remains a dependable link. On touch and pen
        // devices, though, the cards themselves must be a drag surface—there
        // is not enough empty rail space to start a swipe reliably.
        if (event.pointerType === "mouse" && event.target.closest(".hero-project")) return;
        const rail = railRef.current;
        if (!rail) return;

        dragState.current = {
            active: true,
            startX: event.clientX,
            startScroll: rail.scrollLeft,
            moved: false,
        };
        rail.setPointerCapture?.(event.pointerId);
        rail.classList.add("is-dragging");
    };

    const handlePointerMove = (event) => {
        const rail = railRef.current;
        const state = dragState.current;
        if (!rail || !state.active) return;

        const distance = event.clientX - state.startX;
        if (Math.abs(distance) > 4) state.moved = true;
        rail.scrollLeft = state.startScroll - distance;
    };

    const finishDrag = (event) => {
        const rail = railRef.current;
        if (!rail || !dragState.current.active) return;
        const didMove = dragState.current.moved;
        rail.releasePointerCapture?.(event.pointerId);
        rail.classList.remove("is-dragging");
        dragState.current = { active: false, startX: 0, startScroll: 0, moved: false };

        if (!didMove) return;

        suppressClick.current = true;
        window.setTimeout(() => {
            suppressClick.current = false;
        }, 0);
    };

    const preventDraggedClick = (event) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <section className="hero-projects" aria-labelledby="hero-projects-title">
            <div className="hero-projects__intro">
                <div className="hero-projects__heading">
                    <p
                        id="hero-projects-title"
                        className="hero-projects__eyebrow"
                    >
                        <span>Selected Work</span>
                        <span className="hero-projects__glyph" aria-hidden="true">✦</span>
                    </p>
                    <span className="hero-projects__count">
                        ({String(projects.length).padStart(2, "0")})
                    </span>
                </div>

            </div>
            <div className="hero-projects__scroll-guide" aria-hidden="true">
                <div className="hero-projects__scroll-hint">
                    <span>Scroll to explore</span>
                    <svg viewBox="0 0 52 22" focusable="false">
                        <path d="M2 12c12-1 25-2 43-1" />
                        <path d="m38 5 8 6-8 7" />
                    </svg>
                </div>
            </div>
            <div
                ref={railRef}
                className="hero-projects__rail"
                role="list"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                onClickCapture={preventDraggedClick}
            >
                {projects.map((project, index) => (
                    <Link key={project.client} className="hero-project" to={project.href} role="listitem">
                        <span className="hero-project__number">{String(index + 1).padStart(2, "0")}</span>
                        <project.icon className="hero-project__icon" aria-hidden="true" />
                        <span className="hero-project__content">
                            <span className="hero-project__client">{project.client}</span>
                            <span className="hero-project__title">{project.title}</span>
                            <span className="hero-project__description">{project.description}</span>
                        </span>
                        <div className="hero-project__footer">
                            <span className="hero-project__meta">
                                {project.category}
                            </span>
                            <span className="hero-project__arrow">
                                <ArrowUpRight aria-hidden="true" />
                            </span>
                        </div>
                    </Link>
                ))}
                <Link className="hero-project hero-project--all" to="/work" role="listitem">
                    <span>View all<br />projects</span>
                    <ArrowRight aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
