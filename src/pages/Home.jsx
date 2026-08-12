
import PersonalEffects from "../components/personal-effects/PersonalEffects";
import Hero from "../components/Hero/Hero";
import WriteMe from "../components/contact/WriteMe";


function Home() {
  return (
    <main className="section">
      <div
        className="container stack"
        style={{
          alignItems: "flex-start",
          gap: "2rem",
        }}
      >
        
      <Hero>
      </Hero>
      <PersonalEffects>
      </PersonalEffects>
      <WriteMe />
      </div>
    </main>
  );
}

export default Home;
