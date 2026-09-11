import "./selected-work.css";
import { useEffect, useRef, useState } from "react";
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
 {client:"U.S. House",title:"Committee Voting Platform",description:"Making legislative complexity navigable through referrals, context, and clear voting actions.",category:"Government · Product design",href:"/house",icon:Landmark},
 {client:"U.S. Copyright Office",title:"Enterprise UX Architecture",description:"Shared interaction rules for search, navigation, filtering, and administration across products.",category:"Government · Design systems",href:"/library-of-congress",icon:LibraryBig},
 {client:"U.S. Copyright Office",title:"Accounting & Payments",description:"Understanding legacy records, financial rules, and staff workflows before designing what comes next.",category:"Government · UX research",href:"/copyright-accounting",icon:LibraryBig},
 {client:"USDA NASS",title:"Enterprise Application Modernization",description:"A reusable theme connecting accessible patterns, specialized workflows, and engineering.",category:"Government · Design systems",href:"/usda",icon:Grid2X2},
 {client:"Athletico",title:"Patient Onboarding & Scheduling",description:"Clearer entry, appointment access, and responsive care journeys for patients and staff.",category:"Healthcare · Research",href:"/athletico",icon:CirclePlus},
];

export default function HeroProjects({ projects = featuredProjects }) {
    const railRef = useRef(null);
    const [edges, setEdges] = useState({start:true,end:false});
    useEffect(() => {
      const rail = railRef.current;
      const update = () => setEdges({start:rail.scrollLeft <= 2,end:rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2});
      update();
      rail.addEventListener('scroll',update,{passive:true});
      const observer = new ResizeObserver(update); observer.observe(rail);
      return () => { rail.removeEventListener('scroll',update); observer.disconnect(); };
    }, [projects]);
    const scroll = direction => {
      const rail=railRef.current;
      const card=rail.querySelector('.hero-project');
      const step=card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0);
      rail.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
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
            <div className="hero-projects__controls" aria-label="Browse case studies">
              <button type="button" aria-label="Previous case studies" aria-controls="case-study-rail" disabled={edges.start} onClick={()=>scroll(-1)}>←</button>
              <button type="button" aria-label="Next case studies" aria-controls="case-study-rail" disabled={edges.end} onClick={()=>scroll(1)}>→</button>
            </div>
            <div
                ref={railRef}
                className="hero-projects__rail"
                role="group"
                id="case-study-rail"
                tabIndex={0}
                aria-label="Case studies; scroll horizontally or use the previous and next buttons"

            >
                {projects.map((project, index) => (
                    <Link key={project.href} className="hero-project" to={project.href}>
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
                <Link className="hero-project hero-project--all" to="/work">
                    <span>View all<br />projects</span>
                    <ArrowRight aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
