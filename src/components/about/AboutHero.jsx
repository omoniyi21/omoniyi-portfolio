import SectionHeader from "../shared/section-header/SectionHeader";
import Polaroid from "./Polaroid";
import FloatingArtifact from "./FloatingArtifact";
import HandwrittenNote from "./HandwrittenNote";

import "./about.css";


export default function AboutHero() {

  return (
    <section className="about-hero">

      <SectionHeader
        eyebrow="DESIGN DOSSIER"
        title="ABOUT THE DESIGNER"
      />


      <div className="about-hero__grid">


        {/* LEFT SIDE */}
        <div className="about-hero__content">

          <p className="about-hero__label">
            OMONIYI ALIMI
          </p>


          <h1>
            Product designer,
            <br/>
            systems thinker,
            <br/>
            collector of moments.
          </h1>


          <p className="about-hero__body">
            I design products, systems, and experiences 
            that help people navigate complexity with 
            clarity and beauty.
          </p>


          <div className="about-hero__coordinates">

            <span>
              32.7767° N
            </span>

            <span>
              DALLAS, TX
            </span>

            <span>
              CURRENTLY:
              <br/>
              BUILDING SYSTEMS
              <br/>
              COLLECTING IDEAS
            </span>

          </div>


          <HandwrittenNote>
            always looking for the tiny details ✶
          </HandwrittenNote>


        </div>



        {/* RIGHT SIDE */}
        <div className="about-hero__visual">


          <Polaroid />


          <FloatingArtifact
            type="star"
            position="top-right"
          />


          <FloatingArtifact
            type="coffee"
            position="bottom-left"
          />


          <FloatingArtifact
            type="book"
            position="middle-right"
          />


        </div>


      </div>

    </section>
  );
}