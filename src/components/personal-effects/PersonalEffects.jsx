import "./personal-effects.css";
import { Link } from "react-router-dom";

import ObservationsTelescope from "../../assets/branding/stardust-creature-kit/png/1024/observations-telescope.png";
import ReadingPaper from "../../assets/images/personal-effects-refined/reading-paper-v2-trim.png";
import WatchingPaper from "../../assets/images/personal-effects-refined/watching-paper-v2-trim.png";
import MovieTicket from "../../assets/images/personal-effects-refined/movie-ticket-v2-trim.png";
import ScentPaper from "../../assets/images/personal-effects-refined/scent-paper-v3-trim.png";
import RitualPaper from "../../assets/images/personal-effects-refined/ritual-paper-v3-trim.png";
import ThoughtPaper from "../../assets/images/personal-effects-refined/thought-paper-v3-trim.png";
import Podcast from "../../assets/images/personal-effects-refined/podcast-paper-v3-trim.png";
import Playlist from "../../assets/images/personal-effects-refined/playlist-paper-v3-trim.png";
import Trail from "../../assets/images/portfolio-personal-effects-assets/png/12-decorative-constellation-trail.png";

function Paper({ className, src, label, children }) {
  return <article className={`effect-paper ${className}`} aria-label={label}><img src={src} alt="" /><div className="effect-paper__content">{children}</div></article>;
}

export default function PersonalEffects() {
  return <section className="personal-effects" id="personal-effects" aria-labelledby="personal-effects-title">
    <aside className="personal-effects__rail">
      <div className="personal-effects__meta"><span>02</span><span>Personal Effects</span><span className="personal-effects__glyph">✦</span></div>
      <h2 id="personal-effects-title">What’s On My Mind?</h2>
      <p>A few things currently shaping how I think :)</p>
      <Link to="/about">design dossier <span aria-hidden="true">↗</span></Link>
      <img className="personal-effects__stardust stardust--float" src={ObservationsTelescope} alt="SD observing a few creative patterns" />
      <p className="personal-effects__coordinates">7.8003° N, 5.3790° E<br />SD archive<br />Observing, always.</p>
    </aside>
    <div className="personal-effects__spread" aria-label="A collection of current interests and creative fuel">
      <span className="personal-effects__glass-cast" aria-hidden="true" />
      <div className="personal-effects__glass-content">
        <header className="personal-effects__masthead"><span>About me / Design dossier</span><span>Field notes · vol. 01</span></header>
        <Paper className="effect-paper--reading" src={ReadingPaper} label="Currently reading: The Artist's Way by Julia Cameron"><p className="paper-eyebrow">Currently reading</p><h3>The Artist’s<br />Way</h3><p className="paper-author">Julia Cameron</p><span className="paper-doodle paper-doodle--sun" aria-hidden="true">☼</span></Paper>
        <Paper className="effect-paper--watching" src={WatchingPaper} label="Currently watching: FROM and Furious"><p className="paper-eyebrow paper-eyebrow--lavender">Currently watching · TV</p><div className="watching-columns"><div><h3>FROM</h3><p>a mysterious town.<br />no way out.<br />questions at every turn.</p><b>On MGM+</b><span className="watching-doodle watching-doodle--spooky" aria-hidden="true">☾</span></div><div><h3>FURIOUS</h3><p>how victimhood can<br />change you—and how<br />far is too far for revenge.</p><b>On Hulu</b><span className="watching-doodle watching-doodle--angry" aria-hidden="true">&gt;:(</span></div></div></Paper>
        <Paper className="effect-paper--movie" src={MovieTicket} label="Current movie obsession: I Love Boosters"><p className="paper-eyebrow">Current movie obsession</p><h3>I LOVE<br />BOOSTERS</h3><p>the movie that lives<br />in my head rent free.</p><small>Theater 02 · Row D · Seat 07</small></Paper>
        <Paper className="effect-paper--scent" src={ScentPaper} label="Current scent: Ode to Dullness by Juliette Has a Gun"><p className="paper-eyebrow">Current scent</p><p className="scent-brand">Juliette<br />Has a Gun</p><h3>ODE TO<br />DULLNESS</h3><small>WOODY · MUSKY · WARM</small></Paper>
        <Paper className="effect-paper--ritual" src={RitualPaper} label="Current ritual: coffee with honey and a little salt"><p className="paper-eyebrow">Current ritual</p><p className="ritual-copy">coffee with honey<br />a little salt<br />whole lactose-free milk</p><p className="ritual-then">then:<br />walking the dogs</p><span className="ritual-doodle ritual-doodle--cup" aria-hidden="true"><i /><b /></span><span className="ritual-doodle ritual-doodle--paw" aria-hidden="true"><i /><i /><i /><i /><b /></span></Paper>
        <Paper className="effect-paper--thought" src={ThoughtPaper} label="Current thought: Design should feel inevitable"><p className="paper-eyebrow">Current thought</p><p className="thought-copy">Design should<br />feel inevitable.</p></Paper>
        <Paper className="effect-paper--podcast" src={Podcast} label="Podcast recommendation: Good Noticings with Ashley and Claire"><p className="paper-eyebrow">Podcast rec</p><h3>Good Noticings</h3><p className="podcast-hosts">with Ashley &amp; Claire</p><div className="podcast-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><small>EP ————— &nbsp; DATE — / —</small></Paper>
        <Paper className="effect-paper--playlist" src={Playlist} label="On repeat: Julia Wolf, Sade, and Asake"><p className="paper-eyebrow">On repeat <span aria-hidden="true">▶</span></p><div className="playlist-track"><b>01</b><p>Julia Wolf<small>In My Room</small></p></div><div className="playlist-track"><b>02</b><p>Sade<small>By Your Side</small></p></div><div className="playlist-track"><b>03</b><p>Asake<small>MBHC</small></p></div></Paper>
        <img className="personal-effects__trail" src={Trail} alt="" />
      </div>
    </div>
    <section className="personal-effects__mobile-card" aria-label="Current creative fuel">
      <p className="personal-effects__mobile-kicker">About me / design dossier</p>
      <div className="personal-effects__mobile-grid">
        <article><span>Currently reading</span><h3>The Artist’s Way</h3><p>Julia Cameron</p></article>
        <article><span>Currently watching</span><h3>FROM + Furious</h3><p>On MGM+ and Hulu</p></article>
        <article><span>Current movie obsession</span><h3>I Love Boosters</h3><p>The movie that lives in my head rent free.</p></article>
        <article><span>Current scent</span><h3>Ode to Dullness</h3><p>Juliette Has a Gun · woody, musky, warm</p></article>
        <article><span>Current ritual</span><h3>Coffee with honey, a little salt</h3><p>Then walking the dogs.</p></article>
        <article><span>Current thought</span><h3>Design should feel inevitable.</h3></article>
        <article><span>Podcast rec</span><h3>Good Noticings</h3><p>with Ashley &amp; Claire</p></article>
        <article><span>On repeat</span><h3>Julia Wolf · Sade · Asake</h3><p>In My Room · By Your Side · MBHC</p></article>
      </div>
    </section>
  </section>;
}
