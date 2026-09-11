import CelestialDust from "./constellation/CelestialDust";
import HeroAccents from "./constellation/HeroAccents";
import { useState } from "react";
import HeroContent from "./HeroContent";
import HeroConstellation from "./constellation/HeroConstellation";
import HeroProjects from "../work/SelectedWork";
import "./hero.css";
import "../../styles/pages/hero-journal.css";

export default function Hero() {
 const [paused,setPaused]=useState(false);
 return <section className="hero hero-journal" data-sky-paused={paused}>
  <CelestialDust paused={paused} /><HeroAccents />
  <div className="hero__main"><HeroContent /><HeroConstellation paused={paused} />
   <button className="sky-control" type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused ? 'resume sky' : 'pause sky'}</button>
  </div>
  <HeroProjects />
 </section>;
}
