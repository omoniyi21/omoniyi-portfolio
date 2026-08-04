import HeroContent from "./HeroContent";
import HeroConstellation from "./constellation/HeroConstellation";
import HeroProjects from "../work/SelectedWork";

import "./hero.css";

export default function Hero() {

    return (

        <section className="hero">

<div className="hero__main">

<HeroContent />

<HeroConstellation />

</div>


<HeroProjects />

</section>

    );

}