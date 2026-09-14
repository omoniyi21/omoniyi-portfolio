import { useLayoutEffect, useRef, useState } from "react";
import Button from "../shared/button/Button";

const PERSONAS = {
  hiring: {
    tabLabel: "someone hiring",
    eyebrow: "Senior Product Designer, open to full-time roles",
    title: ["I help people", "navigate", "complex systems."],
    description:
      "I turn dense, high-stakes systems into interfaces people actually understand and enjoy using.",
    ctaLabel: "See the case studies",
    ctaTo: "/work",
    secondaryLabel: "Get the résumé",
    secondaryTo: "/about",
  },
  building: {
    tabLabel: "someone building",
    eyebrow: "Design partner & creator of LaunchKit UI",
    title: ["Messy idea?", "I'll take it", "from messy to shipped."],
    description:
      "Need a hand turning a rough idea into a real product? That's Omoniyi Studio. Prefer to build it yourself? Start with LaunchKit UI.",
    ctaLabel: "Start a project",
    ctaTo: "/studio",
    secondaryLabel: "Browse LaunchKit UI",
    secondaryTo: "/uikit",
  },
};

export default function HeroContent({ paused, onToggleDust }) {
  const [persona, setPersona] = useState("hiring");
  const copy = PERSONAS[persona];
  const columnRef = useRef(null);
  const actionsRef = useRef(null);

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
        <span className="desk-persona__label">reading this as:</span>
        <div className="desk-persona__options">
          {Object.entries(PERSONAS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              className={`desk-persona__pill${persona === key ? " is-active" : ""}`}
              aria-pressed={persona === key}
              onClick={() => setPersona(key)}
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
        <Button to={copy.ctaTo}>
          {copy.ctaLabel}
        </Button>
        <Button variant="secondary" to={copy.secondaryTo}>
          {copy.secondaryLabel}
        </Button>
      </div>

      <button
        type="button"
        className="desk-surface__sky-control"
        aria-pressed={paused}
        onClick={onToggleDust}
      >
        {paused ? "resume dust" : "pause dust"}
      </button>
    </div>
  );
}
