import { Link, useNavigate } from 'react-router-dom';
import { morphToCaseStudy } from '../lib/caseStudyTransition';
import { portfolioStudies } from '../data/caseStudies';
import { cardTints } from '../data/cardTints';
import './work.css';
import { Icon } from "../components/shared/icons/Icon";

const covers = ['house-dashboard', 'loc-users', 'payments-legacy', 'usda-admin', 'athletico-overview', 'wedding-emblem-cream', 'portfolio-hiring', 'sultry-hero'];

// One line per card on what happened, so the result is visible before
// anyone opens the study. Only outcomes the case study itself states.
const outcomes = {
  house: 'In pilot with two committees when I left',
  'library-of-congress': 'Search component shipped with docs and accessibility',
  'copyright-accounting': 'Got accounting its own workspace and team',
  usda: 'Theme deployed in six months',
  athletico: 'Tested with about 100 participants',
  'wedding-identity': 'One-week trial, submitted as a proposal',
  'portfolio-ecosystem': 'Live at omoniyialimi.com',
  'sultry-tips': 'Still her mark two years later',
};

// Product work for teams first; studio and self-initiated work after it.
const PRODUCT_COUNT = 5;
const groups = [
  { key: 'product', studies: portfolioStudies.slice(0, PRODUCT_COUNT), offset: 0 },
  { key: 'studio', studies: portfolioStudies.slice(PRODUCT_COUNT), offset: PRODUCT_COUNT },
];

export default function Work() {
  const navigate = useNavigate();
  return (
    <main className="work-page">
      <section className="work-page__header">
        <p>Selected work / {String(PRODUCT_COUNT).padStart(2, '0')} <span>✦</span></p>
        <h1>Systems made <em>navigable.</em></h1>
        <p>I design digital products that make complex work feel clear, useful, and human, and the design systems that keep them consistent.</p>
      </section>
      {groups.map(group => (
        <section key={group.key} className={`work-group work-group--${group.key}`} aria-label={group.key === 'product' ? 'Product case studies' : 'Studio and self-initiated work'}>
          {group.key === 'studio' && (
            <p className="work-group__label">Also / Studio &amp; self-initiated / {String(group.studies.length).padStart(2, '0')} <b aria-hidden="true">✦</b></p>
          )}
          <div className={`work-bento${group.key === 'studio' ? ' work-bento--studio' : ''}`}>
            {group.studies.map((s, n) => {
              const i = group.offset + n;
              return (
                <Link
                  className={`work-card${i === 0 ? ' work-card--house' : ''}`}
                  key={s.slug}
                  to={`/${s.slug}`}
                  onClick={event => morphToCaseStudy(event, navigate, `/${s.slug}`)}
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
                  <dl className="work-card__facts">
                    <div><dt>Role</dt><dd>{s.facts.find(f => f[0] === 'Role')[1]}</dd></div>
                    {outcomes[s.slug] && <div><dt>Result</dt><dd>{outcomes[s.slug]}</dd></div>}
                  </dl>
                  <footer>
                    <ul className="work-card__tags">
                      {s.tags.slice(0, 2).map(t => <li key={t}>{t}</li>)}
                    </ul>
                    <Icon name="arrow-right" strokeWidth={1.5} />
                  </footer>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
      <Link className="work-archive" to="/visual">
        <span className="work-archive__meta">Also / Visual &amp; illustration <b aria-hidden="true">✦</b></span>
        <strong>Illustration, custom lettering, and brand identity</strong>
        <Icon name="arrow-right" strokeWidth={1.5} />
      </Link>
    </main>
  );
}
