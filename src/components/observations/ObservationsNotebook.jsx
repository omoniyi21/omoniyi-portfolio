import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getPublishedObservations } from "../../data/observations";
import Telescope from "../../assets/branding/stardust-creature-kit/png/1024/observations-telescope.png";
import "./observations-notebook.css";

import PinkPaper from "../../assets/images/observations/pink-grid.png";
import CreamPaper from "../../assets/images/observations/cream-paper.png";
import LilacPaper from "../../assets/images/observations/lilac-paper.png";
import PinkClip from "../../assets/images/observations/pink-clip.png";
import Tape from "../../assets/images/observations/gingham-tape.png";
import Frog from "../../assets/images/observations/frog.png";
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
    <Artifact src={CreamPaper} box="171 80 458 640" className="notebook-signup__paper" />
    <Artifact src={PinkClip} box="308 80 183 640" className="notebook-clip" />
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
    <header className="notebook-masthead"><span className="notebook-masthead__label"><svg className="notebook-masthead__star" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0C11.5 7 13 8.5 20 10C13 11.5 11.5 13 10 20C8.5 13 7 11.5 0 10C7 8.5 8.5 7 10 0Z" fill="currentColor" /></svg>From my notebook</span><span>Thinking out loud <i aria-hidden="true">✦</i></span></header>
    <div className="notebook-page">
      <header className="notebook-heading"><p className="notebook-label">Notes on design & being a person</p><h2 id="notebook-title">Observations</h2><p>Things I notice. Things I’m still figuring out.</p></header>
      <div className="notebook-composition">
        {latest ? <article className="notebook-cover">
          <Artifact src={LilacPaper} box="80 82 640 636" className="notebook-cover__backing" />
          <Artifact src={PinkPaper} box="148 80 505 640" className="notebook-cover__paper" />
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
        <div className="notebook-margin"><img src={Telescope} alt="" /><span>always looking<br />a little closer ↙</span><SignupNote /></div>
        {recent.length > 0 && <div className="notebook-recent">{recent.map(post => <Link className="notebook-small" key={post.slug} to={`/observations/${post.slug}`}><img className="notebook-small__paper" src={ReadingPaper} alt="" /><span className="notebook-label">OBS. {post.number} · {post.dateLabel}</span><h3>{post.title}</h3><span>Read Observation ↗</span></Link>)}</div>}
      </div>
      <footer className="notebook-bottom"><span className="notebook-bottom__note"><Artifact src={Frog} box="240 279 320 242" className="notebook-frog" />A few thoughts, kept together.</span><Link to="/observations">See all Observations <span aria-hidden="true">↗</span></Link></footer>
    </div>
  </section>;
}
