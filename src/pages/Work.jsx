import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioStudies } from '../data/caseStudies';
import { cardTints } from '../data/cardTints';
import './work.css';

const covers = ['house-dashboard', 'loc-users', 'payments-legacy', 'usda-admin', 'athletico-overview', 'wedding-emblem-cream', 'portfolio-hiring'];

export default function Work() {
  return (
    <main className="work-page">
      <section className="work-page__header">
        <p>Selected work / 07 <span>✦</span></p>
        <h1>Systems made <em>navigable.</em></h1>
        <p>I design digital products that make complex work feel clear, useful, and human.</p>
      </section>
      <section className="work-bento" aria-label="Case studies">
        {portfolioStudies.map((s, i) => (
          <Link
            className={`work-card${i === 0 ? ' work-card--house' : ''}`}
            key={s.slug}
            to={`/${s.slug}`}
            style={{ '--card-tint': cardTints[i % cardTints.length] }}
          >
            <div className="work-card__meta">
              <span>{s.number} <b aria-hidden="true">✦</b></span>
              <span>{s.facts.find(f => f[0] === 'Timeline')[1]}</span>
            </div>
            <h2>{s.client}</h2>
            <div className="work-visual work-visual--screenshot" style={{ backgroundImage: `url(/case-studies/previews/${covers[i]}.webp)` }}>
              <img
                src={`/case-studies/${covers[i]}.webp${covers[i].startsWith('payments-') ? '?redacted=1' : ''}`}
                alt={`${s.client}: ${s.title}`}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                onLoad={event => { event.currentTarget.style.opacity = 1; }}
              />
            </div>
            <p className="work-card__title">{s.title}</p>
            <footer>
              <ul className="work-card__tags">
                {s.tags.slice(0, 2).map(t => <li key={t}>{t}</li>)}
              </ul>
              <ArrowUpRight aria-hidden="true" />
            </footer>
          </Link>
        ))}
      </section>
    </main>
  );
}
