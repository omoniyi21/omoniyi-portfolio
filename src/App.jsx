import "./styles/app.css";

import Stamp from "./components/stamp/Stamp";
import Button from "./components/button/Button";
import SectionHeader from "./components/section-header/SectionHeader";
import ProjectCard from "./components/project-card/ProjectCard";
import Hero from "./components/hero/Hero";

function App() {
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
      <SectionHeader

title="Selected Work"

description="Enterprise products, accessibility, and scalable design systems."

/>

<ProjectCard


stamp="Government Contract"

pattern="grid"

title="Nike Inc."

description="A conceptual sportswear experience exploring editorial layouts, immersive storytelling, and modern product presentation."

>

<Button>

    View Case Study

</Button>

</ProjectCard>

        
      </div>
    </main>
  );
}

export default App;