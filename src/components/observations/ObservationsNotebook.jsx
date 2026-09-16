import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getPublishedObservations } from "../../data/observations";
import "./observations-notebook.css";

import CreamPaper from "../../assets/images/observations/cream-paper.png";
import LilacPaper from "../../assets/images/observations/lilac-paper.png";
import Tape from "../../assets/images/observations/gingham-tape.png";
import ReadingPaper from "../../assets/images/personal-effects-refined/reading-paper-v2-trim.png";

// The original PNGs are preserved. SVG viewports omit their transparent margins.
function Artifact({ src, box, className }) {
  return <svg className={`notebook-artifact ${className}`} viewBox={box} preserveAspectRatio="none" aria-hidden="true" focusable="false"><image href={src} width="800" height="800" /></svg>;
}

function SignupNote() {
  const form = useRef(null);
  useEffect(() => {
    const host = form.current;
    const loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    loader.setAttribute("data-beehiiv-form", "e321f677-f5bd-4383-b5a5-f77a7285df6b");
    host.appendChild(loader);
    if (!document.querySelector('script[src="https://subscribe-forms.beehiiv.com/attribution.js"]')) {
      const attribution = document.createElement("script");
      attribution.type = "text/javascript";
      attribution.async = true;
      attribution.src = "https://subscribe-forms.beehiiv.com/attribution.js";
      document.body.appendChild(attribution);
    }
    return () => host.replaceChildren();
  }, []);
  return <aside className="notebook-signup" aria-label="Get the next Observation">
    <p className="notebook-label">A note for you</p>
    <h3>Let me send you<br />the next one?</h3>
    <p>Thoughts on design, work, and the life around it. From my notebook to your inbox.</p>
    <div className="notebook-signup__embed" ref={form} />
    <a className="notebook-signup__direct" href="https://omoniyis-newsletter.beehiiv.com/" target="_blank" rel="noopener noreferrer">Open signup form ↗</a>
    <span className="notebook-signature">— Omoniyi ♡</span>
  </aside>;
}

export default function ObservationsNotebook() {
  const [latest, ...recent] = getPublishedObservations().slice(0, 3);
  return <section className="observations-notebook" id="observations" aria-labelledby="notebook-title">
    <header className="notebook-masthead"><div className="notebook-masthead__meta"><span>02</span><span>From my notebook</span><span aria-hidden="true">✦</span></div><span>Thinking out loud <i aria-hidden="true">✦</i></span></header>
    <div className="notebook-page">
      <header className="notebook-heading"><p className="notebook-label">Notes on design & being a person</p><h2 id="notebook-title">Observations</h2><p>Things I notice. Things I’m still figuring out.</p><Link className="notebook-heading__all" to="/observations">See all Observations <span aria-hidden="true">↗</span></Link></header>
      <div className="notebook-composition">
        {latest ? <article className="notebook-cover">
          <Artifact src={LilacPaper} box="80 82 640 636" className="notebook-cover__backing" />
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
        <div className="notebook-margin"><span>always looking<br />a little closer ↙</span><SignupNote /></div>
        {recent.length > 0 && <div className="notebook-recent">{recent.map(post => <Link className="notebook-small" key={post.slug} to={`/observations/${post.slug}`}><img className="notebook-small__paper" src={ReadingPaper} alt="" /><span className="notebook-label">OBS. {post.number} · {post.dateLabel}</span><h3>{post.title}</h3><span>Read Observation ↗</span></Link>)}</div>}
      </div>
    </div>
  </section>;
}
