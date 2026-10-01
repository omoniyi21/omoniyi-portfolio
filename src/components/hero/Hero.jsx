import { useState } from "react";
import HeroContent from "./HeroContent";
import Constellations from "./Constellations";
import WorkSlider from "../work/WorkSlider";
import ProcessSection from "../process/ProcessSection";
import "./hero.css";
import "../../styles/pages/hero-journal.css";
import "./hero-desk.css";

export default function Hero() {
  // Persona lives here so the work pile beside the sheet can reorder for it.
  const [persona, setPersona] = useState("hiring");

  return (
    <section className="hero hero-journal hero-desk">
      <div className="hero__main">
        {/* A desk: one torn sheet of writing, with the work set down beside
            it on the graph paper. The sheet carries the constellations in
            its margins; the prints sit square to the grid next to it. */}
        <div className="desk-surface">
          <div className="desk-surface__grid">
            <div className="desk-surface__paper">
              <div className="desk-surface__shadow" aria-hidden="true">
                <div className="desk-surface__sheet" />
              </div>
              <Constellations />
              <HeroContent persona={persona} onPersonaChange={setPersona} />
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
