import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/shared/button/Button";
import StudioEye from "../components/shared/StudioEye";
import StudioNav from "../components/studio/StudioNav";
import { isMotionReduced } from "../lib/motionPreference";
import headerPhoto from "../assets/images/studio-hero/window-table.jpg";
import "./studio.css";
import "./studio-inquire.css";
import "./studio-about.css";

// The Omoniyi Studio manifesto, in Omoniyi's words (Oct 2026). The page's
// one expressive moment: the eye on the oxblood curtain opens the first
// time the manifesto scrolls into view, the same lift as the Studio
// curtain. With motion reduced it is simply open.
const BELIEFS = [
  "We do not believe expertise should require surrendering control.",
  "We believe the best creative partnerships make clients more capable, not more dependent.",
  "We diagnose before we prescribe, because the obvious solution is not always the right one.",
  "We value evidence, but we also value judgment, taste, accessibility, and the human beings on the other side of every experience.",
  "As tools get faster and production gets easier, discernment matters more.",
  "We treat every business with the care of a good host: attentive, thoughtful, specific, and never generic.",
];

function useOpensInView() {
  const ref = useRef(null);
  const [open, setOpen] = useState(() => isMotionReduced());

  useEffect(() => {
    if (open || !ref.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [open]);

  return [ref, open];
}

export default function StudioAbout() {
  const [eyeRef, eyeOpen] = useOpensInView();

  return (
    <div className="studio-page studio-about">
      <StudioNav current="about" />

      <main id="studio-main">
        <section className="studio-section about-hero">
          <div className="about-hero__copy">
            <p className="studio-eyebrow">
              <span>About the Studio</span>
              <span className="studio-eyebrow__sub">The manifesto</span>
            </p>
            <h1>Good design should leave you <em>clearer than it found you.</em></h1>
            <p className="about-hero__sub">You should understand what changed, why it mattered, and what comes next.</p>
          </div>
          <figure className="about-hero__photo" aria-hidden="true">
            <img src={headerPhoto} alt="" />
          </figure>
        </section>

        <section className="about-curtain" aria-labelledby="beliefs-title">
          <div className="about-curtain__inner">
            <div className="about-curtain__mark" ref={eyeRef}>
              <StudioEye size={168} awake={eyeOpen} />
              <span className="about-curtain__name">Omoniyi</span>
              <span className="about-curtain__label">Studio</span>
            </div>

            <h2 id="beliefs-title" className="visually-hidden">What we believe</h2>
            <ol className="about-beliefs">
              {BELIEFS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>

            <p className="about-goal">
              The goal is not simply better design. It is <em>Guided Independence.</em>
            </p>

            <div className="about-curtain__cta">
              <Button to="/studio/inquire" variant="primary">Tell me what isn’t working</Button>
              <Link to="/studio#production" className="about-curtain__link">How a production runs</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="studio-inquire__escape about-escape">
        <p>
          Prefer email? Write to <a href="mailto:contact@omoniyialimi.com">contact@omoniyialimi.com</a>.
        </p>
      </footer>
    </div>
  );
}
