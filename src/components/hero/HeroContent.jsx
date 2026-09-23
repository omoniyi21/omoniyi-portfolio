import { useLayoutEffect, useRef } from "react";
import Button from "../shared/button/Button";
import { useSpaceTransition } from "../shared/SpaceTransition";
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
  },
};

export default function HeroContent({ paused, onToggleDust, persona, onPersonaChange }) {
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
      <div className="desk-persona" role="group" aria-label="Read this page as">
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
        <Button to={copy.ctaTo} onClick={(event) => handleSpaceClick(event, copy.ctaTo, copy.ctaTone)}>
          {copy.ctaLabel}
        </Button>
        <Button
          variant="secondary"
          to={copy.secondaryTo}
          href={copy.secondaryHref}
          target={copy.secondaryHref ? "_blank" : undefined}
          rel={copy.secondaryHref ? "noreferrer" : undefined}
          onClick={(event) => handleSpaceClick(event, copy.secondaryTo, copy.secondaryTone)}
        >
          {copy.secondaryLabel}
        </Button>
      </div>

      <div className="desk-surface__motion-controls">
        <button
          type="button"
          className="desk-surface__sky-control"
          aria-pressed={paused}
          onClick={onToggleDust}
        >
          {paused ? "resume dust" : "pause dust"}
        </button>
        <MotionToggle className="desk-surface__motion-toggle" />
      </div>
    </div>
  );
}
