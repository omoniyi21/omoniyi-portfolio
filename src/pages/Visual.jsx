import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackToPreviousPage from "../components/shared/BackToPreviousPage";
import { visualWork } from "../data/visualWork";
import "./visual.css";

const src = name => `/case-studies/${name}.webp`;

function Piece({ piece }) {
  return (
    <figure className={`visual-piece${piece.wide ? " visual-piece--wide" : ""}`}>
      <a
        className="visual-piece__frame"
        href={src(piece.image)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enlarge: ${piece.title}`}
        style={{ backgroundImage: `url(/case-studies/previews/${piece.image}.webp)` }}
      >
        <img src={src(piece.image)} alt={`${piece.title}: ${piece.kind.toLowerCase()}`} loading="lazy" decoding="async" />
        <span>View full size <ArrowUpRight size={14} aria-hidden="true" /></span>
      </a>
      <figcaption>
        <p className="visual-piece__kind">{piece.kind}</p>
        <h3>{piece.title}</h3>
        <p>{piece.body}</p>
        <dl>
          <div><dt>My role</dt><dd>{piece.role}</dd></div>
        </dl>
        {piece.credit && <p className="visual-piece__credit">{piece.credit}</p>}
      </figcaption>
    </figure>
  );
}

export default function Visual() {
  const count = visualWork.groups.reduce((n, g) => n + g.pieces.length, 0);
  return (
    <main className="visual-page">
      <div className="study-bar visual-bar"><BackToPreviousPage /><span>OMDesigns archive / {String(count).padStart(2, "0")} pieces</span></div>

      <header className="visual-hero">
        <div className="visual-hero__stack" aria-hidden="true">
          {["visual-breakfast-lettering", "visual-porch-swing", "visual-traitors-flyer"].map(name => <img key={name} src={src(name)} alt="" decoding="async" />)}
        </div>
        <p className="visual-kicker">Visual &amp; illustration <b aria-hidden="true">✦</b></p>
        <h1>{visualWork.title}</h1>
        <p className="visual-hero__summary">{visualWork.summary}</p>
        <nav className="visual-hero__jump" aria-label="Sections">
          {visualWork.groups.map((g, i) => (
            <a key={g.label} href={`#visual-${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span>{g.label}</a>
          ))}
        </nav>
      </header>

      {visualWork.groups.map((group, i) => (
        <section className="visual-group" id={`visual-${i + 1}`} key={group.label} aria-labelledby={`visual-heading-${i}`}>
          <div className="visual-group__intro">
            <p className="visual-kicker">{String(i + 1).padStart(2, "0")} / {group.label} <b aria-hidden="true">✦</b></p>
            <h2 id={`visual-heading-${i}`}>{group.note}</h2>
          </div>
          <div className={`visual-grid${group.pieces.length === 1 ? " visual-grid--single" : ""}`}>
            {group.pieces.map(p => <Piece key={p.image} piece={p} />)}
          </div>
        </section>
      ))}

      <section className="visual-outro" aria-labelledby="visual-outro-heading">
        <p className="visual-kicker">What carries over <b aria-hidden="true">✦</b></p>
        <h2 id="visual-outro-heading">
          The same instincts run through the product work: hierarchy, restraint, and one idea you can read at a glance.
        </h2>
        <div className="visual-outro__links">
          <Link to="/wedding-identity"><span>Case study 06</span><strong>Wedding Identity &amp; Guest Experience <ArrowRight size={20} /></strong></Link>
          <Link to="/studio"><span>Work with me</span><strong>Omoniyi Studio <ArrowRight size={20} /></strong></Link>
        </div>
      </section>
    </main>
  );
}
