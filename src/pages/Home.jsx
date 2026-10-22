import { useRef, useState } from "react";
import useSectionReveal from "../lib/useSectionReveal";
import "../lib/reveal.css";

import ObservationsNotebook from "../components/observations/ObservationsNotebook";
import PersonalEffects from "../components/personal-effects/PersonalEffects";
import Hero from "../components/hero/Hero";
import WriteMe from "../components/contact/WriteMe";
import LaunchKitPopup from "../components/popup/LaunchKitPopup";
import RecommendationQuote from "../components/shared/RecommendationQuote";


function Home() {
  const homeRef = useRef(null);
  useSectionReveal(homeRef);
  const [persona, setPersona] = useState("hiring");
  return (
    <main ref={homeRef} className="section home-journal">
      <div
        className="container stack"
        style={{
          alignItems: "flex-start",
          gap: "2rem",
        }}
      >
        
      <div className="home-journal__opening">
        <Hero persona={persona} onPersonaChange={setPersona} />

      </div>
      <RecommendationQuote />
      <PersonalEffects>
      </PersonalEffects>
      <ObservationsNotebook />
      <WriteMe />
      </div>
      {/* Someone hiring never sees the LaunchKit popup. */}
      <LaunchKitPopup enabled={persona === "building"} />
    </main>
  );
}

export default Home;
