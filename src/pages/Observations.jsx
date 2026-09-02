import { Link } from "react-router-dom";
import Telescope from "../assets/branding/stardust-creature-kit/png/1024/observations-telescope.png";

export default function Observations() {
  return <main className="observations-page">
    <header><p><b>04</b> Observations (Blog) <i>✦</i></p><span>Field notes · vol. 03</span></header>
    <section className="observations-page__hero">
      <p className="observations-page__eyebrow">A living record</p>
      <h1>Things I’m <em>noticing.</em></h1>
      <p>Notes on systems, stories, design, and everything that makes a life feel more considered.</p>
      <img src={Telescope} alt="SD looking through a telescope" />
    </section>
    <section className="observation-index" aria-label="Published observations">
      <p className="observation-index__kicker">Latest field note</p>
      <Link className="observation-card" to="/observations/remote-life-contract-work">
        <div className="observation-card__topline"><span>OBS. 001</span><span>Work / remote life</span></div>
        <div className="observation-card__body">
          <p className="observation-card__issue">A field note on the freedom of remote work, the rhythm of contract life, and learning how to stay.</p>
          <h2>Working from home gave me the kind of life I love. Contract work made it feel temporary.</h2>
          <p className="observation-card__excerpt">A personal note on rituals, acclimating quickly, meaningful camaraderie, and what permanence might mean now.</p>
        </div>
        <div className="observation-card__footer"><span>Read observation</span><span aria-hidden="true">↗</span></div>
      </Link>
    </section>
  </main>;
}
