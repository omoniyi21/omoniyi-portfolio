import { useEffect } from "react";
import { Link } from "react-router-dom";
import { contact, resumes } from "../data/resume";
import { trackEvent } from "../lib/analytics";
import "./resume.css";
import PenMark from "../components/shared/pen-mark/PenMark";

function Linked({ text, link }) {
  if (!link) return text;
  const at = text.indexOf(link.label);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <Link to={link.to}>{link.label}</Link>
      {text.slice(at + link.label.length)}
    </>
  );
}

export default function Resume({ variant = "product" }) {
  const r = resumes[variant];

  useEffect(() => {
    trackEvent("resume_view", { resume_variant: variant });
  }, [variant]);

  const print = () => {
    trackEvent("resume_print", { resume_variant: variant });
    window.print();
  };

  return (
    <main className="resume-page" aria-labelledby="resume-name">
      <div className="resume-toolbar" role="group" aria-label="Choose a résumé">
        <span className="resume-toolbar__label">hiring for:<PenMark variant="circle" color="#80558c" /></span>
        <div className="resume-toolbar__options">
          {Object.entries(resumes).map(([key, value]) => (
            <Link
              key={key}
              to={value.path}
              className={`resume-toolbar__pill${key === variant ? " is-active" : ""}`}
              aria-current={key === variant ? "page" : undefined}
            >
              {value.tab}
            </Link>
          ))}
        </div>
        <button type="button" className="resume-toolbar__print" onClick={print}>
          Save as PDF
        </button>
      </div>

      <article className="resume-sheet">
        <header className="resume-head">
          <h1 id="resume-name">Omoniyi Alimi</h1>
          <p className="resume-head__title">{r.title}</p>
          <p className="resume-head__tagline">{r.tagline}</p>
          <p className="resume-head__contact">
            <span>{contact.location}</span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`https://${contact.site}`}>{contact.site}</a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
          <p className="resume-head__summary">{r.summary}</p>
        </header>

        <section className="resume-section" aria-labelledby="resume-highlights">
          <h2 id="resume-highlights">{r.highlightsTitle}</h2>
          <ul>
            {r.highlights.map((item) => (
              <li key={item.text}><Linked {...item} /></li>
            ))}
          </ul>
        </section>

        <section className="resume-section" aria-labelledby="resume-experience">
          <h2 id="resume-experience">{r.experienceTitle}</h2>
          {r.experience.map((job) => (
            <div className="resume-job" key={job.company}>
              <h3>
                <span>{job.company}</span>
                <span className="resume-job__role">{job.role}</span>
                <span className="resume-job__dates">{job.dates}</span>
              </h3>
              {job.projects.map((project) => (
                <div className="resume-project" key={project.name}>
                  <p className="resume-project__name">
                    <strong>{project.to ? <Link to={project.to}>{project.name}</Link> : project.name}</strong>
                    {project.sub && <span> · {project.sub}</span>}
                  </p>
                  <ul>
                    {project.bullets.map((b) => (
                      <li key={b.text}><Linked {...b} /></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="resume-section" aria-labelledby="resume-skills">
          <h2 id="resume-skills">Skills &amp; Tools</h2>
          <dl className="resume-skills">
            {r.skills.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="resume-section" aria-labelledby="resume-education">
          <h2 id="resume-education">Education</h2>
          <p><strong>{r.education[0]}</strong> · {r.education[1]}</p>
        </section>
      </article>
    </main>
  );
}
