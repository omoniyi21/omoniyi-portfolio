import { useState } from "react";
import HeroContent from "./HeroContent";
import HeroProjects from "../work/SelectedWork";
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
          <CelestialDust paused={dustPaused} mode={persona} />
          <div className="desk-surface__grid">
            <div className="desk-surface__paper">
              <HeroContent
                paused={dustPaused}
                onToggleDust={() => setDustPaused((v) => !v)}
                persona={persona}
                onPersonaChange={setPersona}
              />
            </div>
            <div className="desk-surface__work">
              <HeroProjects />
            </div>
          </div>
        </div>
      </div>
      <ProcessSection />
    </section>
  );
}
