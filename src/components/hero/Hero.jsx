import { useState } from "react";
import HeroContent from "./HeroContent";
import WorkSlider from "../work/WorkSlider";
import ProcessSection from "../process/ProcessSection";
import CelestialDust from "./constellation/CelestialDust";
import "./hero.css";
import "../../styles/pages/hero-journal.css";
import "./hero-desk.css";

export default function Hero() {
  const [dustPaused, setDustPaused] = useState(false);
  // Persona lives here, not inside HeroContent, so the dust field (a
  // sibling) can react to it too — switching "someone building" gives
  // the dust a warm ember kick instead of only swapping copy.
  const [persona, setPersona] = useState("hiring");

  return (
    <section className="hero hero-journal hero-desk">
      <div className="hero__main">
        {/* The whole sheet is one continuous piece of paper now — a torn,
            hand-clipped silhouette drawn in CSS, filled with the real
            paper grain (see .desk-surface). The celestial dust is sized
            and clipped to this same shape, so the headline and the
            case-study note both sit on one torn sheet instead of a clean
            rounded rectangle. */}
        <div className="desk-surface">
          {/* The torn paper (and the dust that lives on it) is its own
              layer, so the work slider can sit on top of the sheet and run
              past its edge instead of being cropped by it. */}
          <div className="desk-surface__shadow" aria-hidden="true">
            {/* two more sheets underneath, slightly askew: the hero is the
                top letter of a small stack (desktop only) */}
            <div className="desk-surface__under desk-surface__under--two" />
            <div className="desk-surface__under desk-surface__under--one" />
            <div className="desk-surface__sheet">
              <CelestialDust paused={dustPaused} mode={persona} />
            </div>
          </div>
          <div className="desk-surface__grid">
            <div className="desk-surface__paper">
              <HeroContent
                paused={dustPaused}
                onToggleDust={() => setDustPaused((v) => !v)}
                persona={persona}
                onPersonaChange={setPersona}
              />
            </div>
            <div className="desk-surface__work desk-surface__work--photos">
              <WorkSlider persona={persona} />
            </div>
          </div>
        </div>
      </div>
      <ProcessSection />
    </section>
  );
}
