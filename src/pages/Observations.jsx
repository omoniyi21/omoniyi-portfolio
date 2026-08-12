import Telescope from "../assets/branding/stardust-creature-kit/png/1024/observations-telescope.png";

export default function Observations() {
  return <main className="observations-page">
    <header><p><b>04</b> Observations <i>✦</i></p><span>Field notes · vol. 03</span></header>
    <section className="observations-page__hero">
      <p className="observations-page__eyebrow">A living record</p>
      <h1>Things I’m <em>noticing.</em></h1>
      <p>Notes on systems, stories, design, and everything that makes a life feel more considered.</p>
      <img src={Telescope} alt="SD looking through a telescope" />
    </section>
    <section className="observations-page__empty" aria-label="Upcoming observations">
      <span>First entry</span><h2>Coming at launch.</h2><p>I’m writing the first one now. Check back soon for a thoughtful field note.</p><i aria-hidden="true">✦</i>
    </section>
  </main>;
}
