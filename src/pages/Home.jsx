
import ObservationsNotebook from "../components/observations/ObservationsNotebook";
import PersonalEffects from "../components/personal-effects/PersonalEffects";
import Hero from "../components/hero/Hero";
import WriteMe from "../components/contact/WriteMe";
import LaunchKitPopup from "../components/popup/LaunchKitPopup";


function Home() {
  return (
    <main className="section home-journal">
      <div
        className="container stack"
        style={{
          alignItems: "flex-start",
          gap: "2rem",
        }}
      >
        
      <div className="home-journal__opening">
        <Hero />
        <ObservationsNotebook />
      </div>
      <PersonalEffects>
      </PersonalEffects>
      <WriteMe />
      </div>
      <LaunchKitPopup />
    </main>
  );
}

export default Home;
