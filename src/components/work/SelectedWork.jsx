import "./selected-work.css";
import { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMotionReduced from "../../lib/useMotionReduced";
import { morphToCaseStudy } from "../../lib/caseStudyTransition";
import {
  ArrowUpRight,
  CirclePlus,
  Flower2,
  Network,
  Grid2X2,
  Landmark,
  LibraryBig,
} from "lucide-react";

// Small sketched wireframes standing in for a UI thumbnail in the middle of
// each sheet — one per case study, drawn in the same thin-line ink as the
// lucide icons rather than a screenshot, so they read as quick notes.
// Every wireframe's shapes run through this one filter, defined once and
// shared by id — feTurbulence + feDisplacementMap bends the otherwise
// ruler-straight rects and lines into something with a hand-sketched
// wobble, instead of looking CAD-drafted.
const WireframeDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="hero-wire-sketch" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

const sketchProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const WireframeVote = () => (
  <svg viewBox="0 0 220 120" {...sketchProps}>
    <g filter="url(#hero-wire-sketch)">
      <rect x="4" y="6" width="212" height="16" rx="4" />
      <line x1="4" y1="46" x2="160" y2="46" /><circle cx="196" cy="46" r="7" />
      <line x1="4" y1="68" x2="160" y2="68" /><circle cx="196" cy="68" r="7" />
      <line x1="4" y1="90" x2="160" y2="90" /><circle cx="196" cy="90" r="7" />
      <line x1="4" y1="112" x2="160" y2="112" /><circle cx="196" cy="112" r="7" />
    </g>
  </svg>
);

const WireframeComponents = () => (
  <svg viewBox="0 0 220 120" {...sketchProps}>
    <g filter="url(#hero-wire-sketch)">
      <rect x="4" y="6" width="58" height="28" rx="6" />
      <rect x="72" y="6" width="58" height="28" rx="4" />
      <line x1="82" y1="20" x2="120" y2="20" />
      <rect x="140" y="6" width="76" height="28" rx="12" />
      <rect x="4" y="46" width="212" height="18" rx="4" />
      <circle cx="16" cy="90" r="10" />
      <rect x="36" y="80" width="80" height="20" rx="4" />
      <rect x="126" y="80" width="90" height="20" rx="4" />
    </g>
  </svg>
);

const WireframeDashboard = () => (
  <svg viewBox="0 0 220 120" {...sketchProps}>
    <g filter="url(#hero-wire-sketch)">
      <rect x="4" y="6" width="58" height="32" rx="4" />
      <rect x="70" y="6" width="58" height="32" rx="4" />
      <rect x="136" y="6" width="58" height="32" rx="4" />
      <line x1="10" y1="112" x2="210" y2="112" />
      <line x1="20" y1="112" x2="20" y2="70" />
      <line x1="45" y1="112" x2="45" y2="50" />
      <line x1="70" y1="112" x2="70" y2="86" />
      <line x1="95" y1="112" x2="95" y2="40" />
      <line x1="120" y1="112" x2="120" y2="60" />
      <line x1="145" y1="112" x2="145" y2="94" />
      <line x1="170" y1="112" x2="170" y2="30" />
    </g>
  </svg>
);

const WireframeSidebar = () => (
  <svg viewBox="0 0 220 120" {...sketchProps}>
    <g filter="url(#hero-wire-sketch)">
      <rect x="4" y="4" width="48" height="112" rx="4" />
      <line x1="14" y1="20" x2="42" y2="20" />
      <line x1="14" y1="36" x2="42" y2="36" />
      <line x1="14" y1="52" x2="42" y2="52" />
      <rect x="64" y="4" width="152" height="22" rx="4" />
      <rect x="64" y="36" width="152" height="34" rx="4" />
      <rect x="64" y="80" width="152" height="34" rx="4" />
    </g>
  </svg>
);

const WireframeCalendar = () => {
  const filled = new Set([3, 9, 16]);
  return (
    <svg viewBox="0 0 220 120" {...sketchProps}>
      <g filter="url(#hero-wire-sketch)">
        <rect x="4" y="4" width="212" height="18" rx="4" />
        {Array.from({ length: 21 }, (_, c) => {
          const x = 4 + (c % 7) * 30.5;
          const y = 32 + Math.floor(c / 7) * 28;
          return filled.has(c)
            ? <rect key={c} x={x} y={y} width="24" height="20" rx="4" fill="currentColor" stroke="none" opacity=".35" />
            : <rect key={c} x={x} y={y} width="24" height="20" rx="4" />;
        })}
      </g>
    </svg>
  );
};

const WireframeEmblem = () => (
  <svg viewBox="0 0 220 120" {...sketchProps}>
    <g filter="url(#hero-wire-sketch)">
      <ellipse cx="110" cy="60" rx="44" ry="56" />
      <ellipse cx="110" cy="60" rx="38" ry="50" />
      <line x1="72" y1="52" x2="148" y2="52" /><line x1="72" y1="68" x2="148" y2="68" />
      <path d="M110 16 C 100 28, 120 36, 110 48" /><circle cx="94" cy="32" r="6" /><circle cx="126" cy="36" r="6" />
      <path d="M110 72 C 100 84, 120 92, 110 104" /><circle cx="94" cy="88" r="6" /><circle cx="126" cy="86" r="6" />
      <line x1="90" y1="60" x2="130" y2="60" />
    </g>
  </svg>
);

const WireframeEcosystem = () => (
  <svg viewBox="0 0 220 120" {...sketchProps}>
    <g filter="url(#hero-wire-sketch)">
      <rect x="80" y="6" width="60" height="30" rx="8" />
      <line x1="110" y1="36" x2="110" y2="56" /><line x1="40" y1="56" x2="180" y2="56" />
      <line x1="40" y1="56" x2="40" y2="74" /><line x1="110" y1="56" x2="110" y2="74" /><line x1="180" y1="56" x2="180" y2="74" />
      <rect x="10" y="74" width="60" height="36" rx="6" /><rect x="80" y="74" width="60" height="36" rx="6" /><rect x="150" y="74" width="60" height="36" rx="6" />
    </g>
  </svg>
);

const wireframes = [WireframeVote, WireframeComponents, WireframeDashboard, WireframeSidebar, WireframeCalendar, WireframeEmblem, WireframeEcosystem];

// Pastel range for the stack itself — blues through purples into pinks —
// applied inline per card (see the Link below) rather than through a CSS
// sibling selector, since each sheet now lives in its own single-child
// wrapper div and can't be told apart by :nth-of-type.
const cardTints = ["#e7edfb", "#e9e3fa", "#f6e8f5", "#f0e1f7", "#fbe6ee"];

const featuredProjects = [
 {client:"U.S. House",title:"Committee Voting Platform",description:"Making legislative complexity navigable through referrals, context, and clear voting actions.",category:"Government · Product design",href:"/house",icon:Landmark},
 {client:"U.S. Copyright Office",title:"Enterprise UX Architecture",description:"Shared interaction rules for search, navigation, filtering, and administration across products.",category:"Government · Design systems",href:"/library-of-congress",icon:LibraryBig},
 {client:"U.S. Copyright Office",title:"Accounting & Payments",description:"Understanding legacy records, financial rules, and staff workflows before designing what comes next.",category:"Government · UX research",href:"/copyright-accounting",icon:LibraryBig},
 {client:"USDA NASS",title:"Enterprise Application Modernization",description:"A reusable theme connecting accessible patterns, specialized workflows, and engineering.",category:"Government · Design systems",href:"/usda",icon:Grid2X2},
 {client:"Athletico",title:"Patient Onboarding & Scheduling",description:"Clearer entry, appointment access, and responsive care journeys for patients and staff.",category:"Healthcare · Research",href:"/athletico",icon:CirclePlus},
 {client:"Independent studio work",title:"Wedding Identity & Guest Experience",description:"An original emblem, keepsakes, and décor that carry two heritages into one celebration.",category:"Experience design · Illustration",href:"/wedding-identity",icon:Flower2},
 {client:"Self-initiated",title:"Portfolio Ecosystem",description:"One designer, three audiences, one system: a portfolio built to read differently for each visitor.",category:"Information architecture · Build",href:"/portfolio-ecosystem",icon:Network},
];

// The header/illustration/footer markup shared by both a real, interactive
// sheet in the visible stack and its invisible twin in the measuring rig
// below — kept in one place so the two never drift apart.
function ProjectCardBody({ project, index, Wireframe }) {
  return (
    <>
      <span className="hero-project__header">
        <span className="hero-project__number">{String(index + 1).padStart(2, "0")}</span>
        <span className="hero-project__content">
          <span className="hero-project__client">{project.client}</span>
          <span className="hero-project__title">{project.title}</span>
          <span className="hero-project__description">{project.description}</span>
        </span>
        <project.icon className="hero-project__icon" aria-hidden="true" />
      </span>
      <span className="hero-project__wireframe" aria-hidden="true">
        <Wireframe />
      </span>
      <span className="hero-project__footer">
        <span className="hero-project__meta">{project.category}</span>
        <span className="hero-project__arrow"><ArrowUpRight aria-hidden="true" /></span>
      </span>
    </>
  );
}

// One case study at a time, presented as a torn note-pad sheet sitting in a
// small fanned stack — advancing tears the front sheet off to the side and
// reveals the next one (a different color) already waiting underneath,
// instead of scrolling a rail of side-by-side cards.
export default function HeroProjects({ projects = featuredProjects }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const sectionRef = useRef(null);
    const measureRef = useRef(null);

    const reduceMotion = useMotionReduced();
    const navigate = useNavigate();

    const go = (dir) => {
      setIndex((current) => {
        const next = current + dir;
        return next < 0 || next > projects.length - 1 ? current : next;
      });
      setDirection(dir);
    };

    // The stack is a pile of absolutely-positioned sheets (needed for the
    // tear/fan animation), so nothing in normal flow tells the rail how
    // tall to be — it fell back to one fixed guess for every project. That
    // guess fit the shortest case study and clipped the longest one (long
    // title + long description), which is what caused text to overflow the
    // sheet's own torn silhouette and show through its neighbor's mask
    // gaps. Instead, an offscreen copy of every project's real content is
    // measured at its natural (unconstrained) height, and the tallest one
    // sets the rail's height — so every sheet, including the longest,
    // always has room to lay out cleanly before it's ever clipped to the
    // paper shape.
    useLayoutEffect(() => {
      const section = sectionRef.current;
      const measure = measureRef.current;
      if (!section || !measure) return;
      const cards = measure.querySelectorAll(".hero-project");
      const recompute = () => {
        let max = 0;
        cards.forEach((card) => {
          max = Math.max(max, card.getBoundingClientRect().height);
        });
        if (max > 0) {
          section.style.setProperty("--project-card-h", `${Math.ceil(max)}px`);
        }
      };
      recompute();
      const observer = new ResizeObserver(recompute);
      observer.observe(measure);
      return () => observer.disconnect();
    }, [projects]);

    // depth 0 = front sheet, 1-2 = peeking out from behind it, fanned a
    // little in alternating directions like a stack of note-pad pages.
    const depthStyles = [
      { y: 0, rot: 0, scale: 1 },
      { y: 10, rot: -3, scale: .96 },
      { y: 18, rot: 2, scale: .93 },
    ];

    return (
        <section className="hero-projects" aria-labelledby="hero-projects-title" ref={sectionRef}>
            <WireframeDefs />
            <div className="hero-projects__intro">
                <p id="hero-projects-title" className="hero-projects__eyebrow">
                    <span>Selected Work</span>
                    <span className="hero-projects__glyph" aria-hidden="true">✦</span>
                </p>
                <span className="hero-projects__count">
                    {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <div className="hero-projects__controls" aria-label="Browse case studies">
                    <button type="button" aria-label="Previous case study" aria-controls="case-study-rail" disabled={index <= 0} onClick={() => go(-1)}>←</button>
                    <button type="button" aria-label="Next case study" aria-controls="case-study-rail" disabled={index >= projects.length - 1} onClick={() => go(1)}>→</button>
                </div>
            </div>

            <div
                className="hero-projects__rail"
                role="group"
                id="case-study-rail"
                aria-label="Case studies; use the previous and next buttons to tear off the top sheet"
            >
                {projects.map((project, i) => {
                    const rel = i - index;
                    let transform, opacity, zIndex, pointerEvents;

                    if (rel < 0) {
                        // already torn off — exits the way it was last swiped
                        transform = reduceMotion
                          ? "translate(0, 0) rotate(0deg) scale(1)"
                          : `translate(${direction * 130}%, -6%) rotate(${direction * 9}deg) scale(.95)`;
                        opacity = 0;
                        zIndex = 50;
                        pointerEvents = "none";
                    } else {
                        const depth = Math.min(rel, 2);
                        const d = depthStyles[depth];
                        transform = `translate(0, ${d.y}px) rotate(${d.rot}deg) scale(${d.scale})`;
                        opacity = rel > 2 ? 0 : depth === 2 ? .95 : 1;
                        zIndex = 40 - depth;
                        pointerEvents = rel === 0 ? "auto" : "none";
                    }

                    const Wireframe = wireframes[i % wireframes.length];

                    return (
                        <div
                            key={project.href}
                            className="hero-project-slot"
                            style={{
                                transform,
                                opacity,
                                zIndex,
                                pointerEvents,
                                transitionDuration: reduceMotion ? "0s" : undefined,
                            }}
                            aria-hidden={rel !== 0}
                        >
                            <Link
                                className="hero-project"
                                to={project.href}
                                tabIndex={rel === 0 ? 0 : -1}
                                onClick={(event) => morphToCaseStudy(event, navigate, project.href)}
                                style={{ "--card-tint": cardTints[i % cardTints.length] }}
                            >
                                <ProjectCardBody project={project} index={i} Wireframe={Wireframe} />
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Invisible twins of every sheet, laid out at their natural height
                (not stretched/clipped to the stack's box) purely so their real
                height can be measured — see the effect above. */}
            <div className="hero-projects__measure" aria-hidden="true" ref={measureRef}>
                {projects.map((project, i) => {
                    const Wireframe = wireframes[i % wireframes.length];
                    return (
                        <div className="hero-project" key={`measure-${project.href}`}>
                            <ProjectCardBody project={project} index={i} Wireframe={Wireframe} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
