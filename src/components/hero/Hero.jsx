import { useState } from "react";
import HeroContent from "./HeroContent";
import WorkSlider from "../work/WorkSlider";
import ProcessSection from "../process/ProcessSection";
import Postmark from "./Postmark";
import "./hero.css";
import "../../styles/pages/hero-journal.css";
import "./hero-desk.css";

export default function Hero() {
  // Persona lives here so the copy and the work pile both follow it.
  const [persona, setPersona] = useState("hiring");

  return (
    <section className="hero hero-journal hero-desk">
      <div className="hero__main">
        {/* The hero is a pile of papers on a desk: a landscape postcard at
            the bottom (with two more sheets under it for the other spaces),
            the words on its left, and the work prints laid on its right
            side, running a little past its edge. */}
        <div className="desk-surface desk-surface--postcard">
          <div className="postcard" aria-hidden="true">
            <div className="postcard__under postcard__under--two" />
            <div className="postcard__under postcard__under--one" />
            <div className="postcard__card" />
            <Postmark className="postcard__postmark" />
          </div>
          <div className="desk-surface__grid">
            <div className="desk-surface__paper">
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
