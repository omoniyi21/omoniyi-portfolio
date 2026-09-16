import { Link } from "react-router-dom";
import { getPublishedObservations } from "../../data/observations";
import BeehiivEmbed from "./BeehiivEmbed";
import "./observations-notebook.css";

import PinkGrid from "../../assets/images/observations/pink-grid.png";
import CreamPaper from "../../assets/images/observations/cream-paper.png";
import Tape from "../../assets/images/observations/gingham-tape.png";
import ReadingPaper from "../../assets/images/personal-effects-refined/reading-paper-v2-trim.png";

// The original PNGs are preserved. SVG viewports omit their transparent margins.
function Artifact({ src, box, className }) {
  return <svg className={`notebook-artifact ${className}`} viewBox={box} preserveAspectRatio="none" aria-hidden="true" focusable="false"><image href={src} width="800" height="800" /></svg>;
}

function SignupNote() {
  return <aside className="notebook-signup" aria-label="Get the next Observation">
    <div className="notebook-signup__main">
      <div className="notebook-signup__top">
        <p className="notebook-label">A note for you</p>
        <h3>Let me send you<br />the next one?</h3>
        <p className="notebook-signup__desc">Design, culture, things I’m building, and whatever has my attention this week.</p>
      </div>
      <div className="notebook-signup__form">
        <BeehiivEmbed className="notebook-signup__embed" />
        <span className="notebook-signature">— Omoniyi ♡</span>
      </div>
    </div>
  </aside>;
}

export default function ObservationsNotebook() {
  const [latest, ...recent] = getPublishedObservations().slice(0, 3);
  return <section className="observations-notebook" id="observations" aria-labelledby="notebook-title">
    <header className="notebook-masthead"><div className="notebook-masthead__meta"><span>02</span><span>From my notebook</span><span aria-hidden="true">✦</span></div><span>Thinking out loud <i aria-hidden="true">✦</i></span></header>
    <div className="notebook-page">
      <div className="notebook-top">
        <header className="notebook-heading"><p className="notebook-label">Notes on design & being a person</p><h2 id="notebook-title">Observations</h2><p>Things I notice. Things I’m still figuring out.</p><Link className="notebook-heading__all" to="/observations">See all Observations <span aria-hidden="true">↗</span></Link></header>
        <SignupNote />
      </div>
      <div className="notebook-composition">
        <div className="notebook-cover-frame">
          <span className="notebook-cover-note" aria-hidden="true">always looking<br />a little closer
            <svg className="notebook-cover-note__arrow" viewBox="0 0 32 44" fill="none" aria-hidden="true">
              <path d="M6 4C14 12 4 22 14 28C18 30 19 34 17 40M17 40C14 36 10 34 6 33M17 40C20 37 24 35 28 35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {latest ? <article className="notebook-cover">
            <Artifact src={PinkGrid} box="148 80 505 640" className="notebook-cover__backing" />
            <Artifact src={CreamPaper} box="148 80 505 640" className="notebook-cover__paper" />
            <Artifact src={Tape} box="80 138 640 243" className="notebook-tape" />
            <Link to={`/observations/${latest.slug}`}>
              <span className="notebook-latest-label">Latest Observation</span>
              <div className="notebook-cover__meta"><span>OBS. {latest.number}</span><span>{latest.category}</span></div>
              <h3>{latest.title}</h3>
              {latest.image && <img className="notebook-cover__image" src={latest.image} alt={latest.imageAlt || ""} />}
              <p className="notebook-cover__excerpt">{latest.excerpt}</p>
              <footer><span>{latest.dateLabel}</span><span>Read Observation ↗</span></footer>
            </Link>
          </article> : <p className="notebook-cover">The next page is still taking shape. Come back soon.</p>}
        </div>
        {recent.length > 0 && <div className="notebook-recent">{recent.map(post => <Link className="notebook-small" key={post.slug} to={`/observations/${post.slug}`}><img className="notebook-small__paper" src={ReadingPaper} alt="" /><span className="notebook-label">OBS. {post.number} · {post.dateLabel}</span><h3>{post.title}</h3><span>Read Observation ↗</span></Link>)}</div>}
      </div>
    </div>
  </section>;
}
