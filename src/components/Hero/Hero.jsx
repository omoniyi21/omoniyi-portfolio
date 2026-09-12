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
  <span className="hero-journal__name"><svg className="hero-journal__rule-star" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0C11.5 7 13 8.5 20 10C13 11.5 11.5 13 10 20C8.5 13 7 11.5 0 10C7 8.5 8.5 7 10 0Z" fill="currentColor" /></svg>Omoniyi Alimi</span>
  <CelestialDust paused={paused} /><HeroAccents />
  <div className="hero__main"><HeroContent /><HeroConstellation paused={paused} />
   <button className="sky-control" type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused ? 'resume sky' : 'pause sky'}</button>
  </div>
  <HeroProjects />
 </section>;
}
