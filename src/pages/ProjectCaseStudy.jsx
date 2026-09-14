import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackToPreviousPage from "../components/shared/BackToPreviousPage";
import { portfolioStudies } from "../data/caseStudies";
import { cardTints } from "../data/cardTints";
import "./project-case-study.css";

const chapters = ["Snapshot", "Problem", "Understanding the System", "What I Learned", "Decisions That Shaped the Product", "The Experience", "The System Behind the Product", "Outcome & Reflection"];
const imagePath = name => `/case-studies/${name}.webp${name.startsWith("payments-") ? "?redacted=1" : ""}`;
function Evidence({ image, caption, compact = false }) {
  return <figure className={`study-evidence${compact ? " study-evidence--compact" : ""}`}>
    <a href={imagePath(image)} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge: ${caption}`}><img src={imagePath(image)} alt={caption} loading="lazy" decoding="async" /><span>View detail <ArrowUpRight size={14}/></span></a>
    <figcaption>{caption}{image.startsWith("payments-") && <strong className="study-redacted"> Data blurred for confidentiality.</strong>}</figcaption>
  </figure>;
}
export default function ProjectCaseStudy({ study }) {
  const index = portfolioStudies.findIndex(s => s.slug === study.slug);
  const next = portfolioStudies[(index + 1) % portfolioStudies.length];
  const tint = cardTints[index % cardTints.length];
  return <main className={`portfolio-study portfolio-study--${study.slug}`} style={{ "--study-tint": tint }}>
    <title>{study.client} — {study.title} | Omoniyi Alimi</title>
    <meta name="description" content={study.summary}/>
    <div className="study-bar"><BackToPreviousPage/><span>{study.client} / {study.number}</span></div>
    <header className="study-hero">
      <div className="study-hero__copy"><p className="study-kicker">Case study {study.number} <b aria-hidden="true">✦</b></p><p className="study-client">{study.client}</p><h1>{study.title}</h1><p className="study-summary">{study.summary}</p><ul className="study-tags">{study.tags.map(t=><li key={t}>{t}</li>)}</ul><div className="study-actions"><a href="#snapshot">Explore the story <ArrowRight size={16}/></a>{study.figma && <a href={study.figma} target="_blank" rel="noopener noreferrer">View Figma <ArrowUpRight size={16}/></a>}</div></div>
      <div className="study-anatomy"><p className="study-kicker">Anatomy of the project <b aria-hidden="true">✦</b></p>{study.hero.map(([image,caption])=><Evidence key={image} image={image} caption={caption} compact/>)}</div>
    </header>
    <nav className="study-contents" aria-label="Case study sections">{chapters.map((c,i)=><a key={c} href={`#${i===0?'snapshot':`chapter-${i+1}`}`}><span>{String(i+1).padStart(2,'0')}</span>{c}</a>)}</nav>
    {study.sections.map((s,i)=><section className={`study-section study-section--${i+1}`} id={i===0?'snapshot':`chapter-${i+1}`} key={s.title} aria-labelledby={`heading-${i}`}>
      <p className="study-kicker">{String(i+1).padStart(2,'0')} / {chapters[i]} <b aria-hidden="true">✦</b></p>
      <div className="study-section__intro"><h2 id={`heading-${i}`}>{s.title}</h2>{s.body && <p>{s.body}</p>}</div>
      {i===0 && <><dl className="study-facts">{study.facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="study-proof">{study.proof.map(([value,label])=><p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div></>}
      {s.items && <div className={`study-items${i===3?' study-items--insights':''}`}>{s.items.map(item=><article key={item.title}><h3>{item.title}</h3>{item.observation ? <dl>{[['Observation',item.observation],['Design principle',item.principle],['Product response',item.response]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p>{item.body}</p>}{item.image && <Evidence image={item.image} caption={item.caption} compact/>}</article>)}</div>}
      {s.images && <div className={`study-gallery${s.images.length===1?' study-gallery--single':''}`}>{s.images.map(([image,caption])=><Evidence key={image} image={image} caption={caption}/>)}</div>}
      {s.quote && <blockquote>{s.quote}</blockquote>}
    </section>)}
    <nav className="study-next" aria-label="More case studies"><Link to="/work">All five case studies</Link><Link to={`/${next.slug}`}><span>Next / {next.client}</span><strong>{next.title} <ArrowRight size={24}/></strong></Link></nav>
  </main>;
}
