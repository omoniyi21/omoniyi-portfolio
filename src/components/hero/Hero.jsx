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
          <CelestialDust paused={dustPaused} />
          <div className="desk-surface__grid">
            <div className="desk-surface__paper">
              <HeroContent paused={dustPaused} onToggleDust={() => setDustPaused((v) => !v)} />
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
