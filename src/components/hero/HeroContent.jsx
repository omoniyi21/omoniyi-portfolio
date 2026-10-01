import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import StampButton from "../shared/paper/StampButton";
import TagButton from "../shared/paper/TagButton";
import { useSpaceTransition } from "../shared/spaceTransitionContext";
import MotionToggle from "../shared/MotionToggle";
import PenMark from "../shared/pen-mark/PenMark";

const PERSONAS = {
  hiring: {
    tabLabel: "someone hiring",
    eyebrow: "Senior Product Designer",
    title: ["I find clarity", "inside complex", "systems and design", "from there."],
    description:
      "I design clear, thoughtful experiences for systems where the information is dense, the stakes are high, and getting the next step right matters.",
    ctaLabel: "See the case studies",
    ctaTo: "/work",
    secondaryLabel: "Read the résumé",
    secondaryTo: "/resume",
    ps: "I shape products, homes, ideas, relationships, and communities around one purpose: helping people feel more deeply human.",
  },
  building: {
    tabLabel: "someone building",
    eyebrow: "Design partner & creator of LaunchKit UI",
    title: ["Bring me the rough idea.", "I’ll turn it into", "something real."],
    description:
      "Bring me the notes, references, conflicting ideas, weird constraints, and ambitious vision. I’ll help make sense of it and turn it into something designed to ship.",
    ctaLabel: "Start a project",
    ctaTo: "/studio",
    ctaTone: "studio",
    secondaryLabel: "Browse LaunchKit UI",
    secondaryTo: "/uikit",
    secondaryTone: "ui",
    ps: "My greatest talent is world building.",
  },
};

// "reading this as:" — the reading-mode toggle for the homepage
function PersonaToggle({ persona, onPersonaChange, className }) {
  return (
    <div className={`desk-persona ${className}`} role="group" aria-label="Read this page as">
      <span className="desk-persona__label">reading this as:<PenMark color="#7569e3" /></span>
      <div className="desk-persona__options">
        {Object.entries(PERSONAS).map(([key, value]) => (
          <button
            key={key}
            type="button"
            className={`desk-persona__pill${persona === key ? " is-active" : ""}`}
            aria-pressed={persona === key}
            onClick={() => onPersonaChange(key)}
          >
            {value.tabLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HeroContent({ persona, onPersonaChange }) {
  const copy = PERSONAS[persona];
  const columnRef = useRef(null);
  const actionsRef = useRef(null);
  const { goTo } = useSpaceTransition();

  // Only the "building" persona's CTAs actually cross into another space
  // (Studio, LaunchKit UI) — everything else (case studies, the résumé
  // file) stays a plain link and this is a no-op.
  const handleSpaceClick = (event, to, tone) => {
    if (!tone || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goTo(to, tone);
  };

  // The case-study card on the other side of the grid should bottom out
  // exactly where the action row ends here — not the whole column (which
  // keeps going below, into the dust-pause control).
  useLayoutEffect(() => {
    const column = columnRef.current;
    const actions = actionsRef.current;
    const grid = column?.closest(".desk-surface__grid");
    // The paper card (not the padded text column inside it) is the actual
    // grid item — it shares the work column's grid-row start (align-items:
    // start). Measuring from the paper's own top, rather than from the text
    // column padded inside it, is what keeps the work card's bottom edge
    // landing exactly on the action row's bottom.
    const paper = column?.closest(".desk-surface__paper") || column;
    if (!column || !actions || !grid || !paper) return;
    const measure = () => {
      const top = paper.getBoundingClientRect().top;
      const bottom = actions.getBoundingClientRect().bottom;
      grid.style.setProperty("--work-card-h", `${bottom - top}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(paper);
    observer.observe(actions);
    return () => observer.disconnect();
  }, [persona]);

  return (
    <div className="hero__content desk-surface__text" ref={columnRef}>
      {/* Phones and tablets: the toggle stays at the top of the reading card. */}
      <PersonaToggle persona={persona} onPersonaChange={onPersonaChange} className="desk-persona--inline" />
      {/* Desktop: the same toggle sits in the header, between the logo and
          the Menu button. Homepage only, since it only changes this page.
          CSS shows exactly one of the two, and display:none keeps the
          hidden one out of the accessibility tree. */}
      {typeof document !== "undefined" &&
        createPortal(
          <PersonaToggle persona={persona} onPersonaChange={onPersonaChange} className="desk-persona--header" />,
          document.body,
        )}

      <p className="desk-letterhead">From the desk of Omoniyi</p>

      <p className="hero__eyebrow">
        <span>{copy.eyebrow}</span>
        <span className="hero__eyebrow-star" aria-hidden="true">✦</span>
      </p>

      <h1 className="hero__title">
        {copy.title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>

      <p className="hero__description">{copy.description}</p>

      <div className="desk-surface__actions" ref={actionsRef}>
        <StampButton to={copy.ctaTo} onClick={(event) => handleSpaceClick(event, copy.ctaTo, copy.ctaTone)}>
          {copy.ctaLabel}
        </StampButton>
        <TagButton to={copy.secondaryTo} onClick={(event) => handleSpaceClick(event, copy.secondaryTo, copy.secondaryTone)}>
          {copy.secondaryLabel}
        </TagButton>
      </div>

      <p className="desk-ps">
        <span className="desk-ps__mark">P.S.</span> {copy.ps}
        <span className="desk-ps__sign">Omoniyi</span>
      </p>

      <div className="desk-surface__motion-controls">
        <MotionToggle className="desk-surface__motion-toggle" />
      </div>
    </div>
  );
}
