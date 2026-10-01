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
        {/* The hero is a letter on the desk: the headline lives on its own
            sheet (with two more stacked under it on desktop), and the work
            prints sit beside it straight on the graph paper. The dust stays
            on the letter. */}
        <div className="desk-surface desk-surface--letter">
          <div className="desk-surface__grid">
            <div className="desk-surface__paper">
              <div className="desk-surface__shadow" aria-hidden="true">
                <div className="desk-surface__under desk-surface__under--two" />
                <div className="desk-surface__under desk-surface__under--one" />
                <div className="desk-surface__sheet">
                  <CelestialDust paused={dustPaused} mode={persona} />
                </div>
              </div>
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
