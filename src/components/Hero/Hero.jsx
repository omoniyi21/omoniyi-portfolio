import HeroContent from "./HeroContent";
import HeroConstellation from "./HeroConstellation";
import HeroProjects from "./HeroProjects";

import "./hero.css";

export default function Hero() {

    return (

        <section className="hero">

            <HeroContent />

            <HeroConstellation />

            <HeroProjects />

        </section>

    );

}