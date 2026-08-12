import "./personal-effects.css";

import PaperCard from "./PaperCard";
import ObservationsTelescope from "../../assets/branding/stardust-creature-kit/png/512/observations-telescope.png";

export default function PersonalEffects() {
  return (
    <section className="personal-effects" id="personal-effects" aria-labelledby="personal-effects-title">
      <aside className="personal-effects__rail">
        <div className="personal-effects__meta">
          <span>02</span>
          <span>Personal Effects</span>
          <span className="personal-effects__glyph" aria-hidden="true">✦</span>
        </div>
        <h2 id="personal-effects-title">What’s On My Mind?</h2>
        <p>A few things currently shaping how I think :)</p>
        <a href="#design-dossier">design dossier <span aria-hidden="true">↗</span></a>

        <img className="personal-effects__stardust stardust--float" src={ObservationsTelescope} alt="SD observing a few creative patterns" />
        <p className="personal-effects__coordinates">7.8003° N, 5.3790° E<br />SD archive<br />Observing, always.</p>
      </aside>

      <div className="personal-effects__spread" aria-label="A collection of current interests and creative fuel">
        <span className="personal-effects__glass-cast" aria-hidden="true" />
        <div className="personal-effects__glass-content">
          <header className="personal-effects__masthead">
            <span>In my bag</span>
            <span>Field notes · vol. 01</span>
          </header>
          <span className="personal-effects__section-marker" aria-hidden="true">02</span>
          <PaperCard className="effect-reading" variant="reading" label="Currently reading: The Artist's Way by Julia Cameron">
            <span className="paper-card__tape" aria-hidden="true" />
            <span className="paper-card__clip" aria-hidden="true" />
            <p className="paper-card__eyebrow">Reading</p>
            <div className="reading-card__rule" aria-hidden="true" />
            <h3>The Artist’s Way</h3>
            <p className="reading-card__author">Julia Cameron</p>
            <div className="reading-card__rule reading-card__rule--short" aria-hidden="true" />
            <span className="reading-card__sprig" aria-hidden="true">⌇</span>
          </PaperCard>

          <PaperCard className="effect-watching" variant="watching" label="Currently watching: FROM and Furious">
            <p className="paper-card__eyebrow paper-card__eyebrow--lavender">Watching · TV</p>
            <div className="watching-card__columns">
              <section>
                <h3>FROM</h3>
                <div className="watching-card__constellation" aria-hidden="true">⌁ · ✦ · ⌁</div>
                <p>a mysterious town.<br />no way out.<br />questions at every turn.</p>
                <span>On <b>MGM+</b></span>
              </section>
              <section>
                <h3>FURIOUS</h3>
                <div className="watching-card__constellation" aria-hidden="true">⌁ · ✦ · ⌁</div>
                <p>how victimhood can<br />change you—and how<br />far is too far for revenge.</p>
                <span>On <b>Hulu</b></span>
              </section>
            </div>
            <p className="watching-card__note">⌁ we have theories.</p>
          </PaperCard>

          <PaperCard className="effect-movie" variant="ticket" label="Movie obsession: I Love Boosters">
            <p className="ticket-card__side">07/2024</p>
            <div className="ticket-card__body">
              <p className="paper-card__eyebrow">Movie obsession</p>
              <h3>I Love<br />Boosters</h3>
              <p>the movie that lives<br />in my head rent free.</p>
              <div className="ticket-card__stub"><span>Theater 02</span><span>Row D</span><span>Seat 07</span></div>
            </div>
            <p className="ticket-card__side ticket-card__side--right">Admit one</p>
          </PaperCard>
        </div>
      </div>
    </section>
  );
}
