import "./selected-work.css";
import { useRef } from "react";

const featuredProjects = [
    { client: "U.S. House", title: "Digital services", category: "Government", href: "#work" },
    { client: "USDA", title: "Data systems", category: "Government", href: "#work" },
    { client: "Athletico", title: "Care journeys", category: "Healthcare", href: "#work" },
    { client: "Library of Congress", title: "Enterprise systems", category: "Government", href: "#work" },
    { client: "Movie Club <3", title: "A Third Space", category: "Hobbies", href: "#work" },
];

// const railRef = useRef(null);

// const handleWheel = (e) => {
//     if (!railRef.current) return;

//     railRef.current.scrollLeft += e.deltaY;
// };

export default function HeroProjects({ projects = featuredProjects }) {
    return (
        <section className="hero-projects" aria-labelledby="hero-projects-title">
            <div className="hero-projects__intro">
                <div className="hero-projects__heading">
                    <p
                        id="hero-projects-title"
                        className="hero-projects__eyebrow"
                    >
                        Selected Work
                    </p>
                    <span className="hero-projects__count">
                        ({String(projects.length).padStart(2, "0")})
                    </span>
                </div>

            </div>
            <div className="hero-projects__rail" role="list" >
                {projects.map((project, index) => (
                    <a key={project.client} className="hero-project" href={project.href} role="listitem">
                        <span className="hero-project__number">{String(index + 1).padStart(2, "0")}</span>
                        <span className="hero-project__content">
                            <span className="hero-project__client">{project.client}</span>
                            <span className="hero-project__title">{project.title}</span>
                        </span>
                        <div className="hero-project__footer">
                            <span className="hero-project__meta">
                                {project.category}
                            </span>
                            <span className="hero-project__arrow">

                                ↗

                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}