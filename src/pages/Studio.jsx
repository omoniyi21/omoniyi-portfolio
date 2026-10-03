import BrandSignature from "../components/shared/BrandSignature";
import SpaceSwitcher from "../components/shared/SpaceSwitcher";
import studioHeroWindow from "../assets/images/studio-hero/window-table.jpg";
import studioHeroCoffee from "../assets/images/studio-hero/coffee.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import Button from "../components/shared/button/Button";
import "./studio.css";

import { recommendations } from "../data/recommendations";
import { ADMISSION, CHECK_AREAS, FRACTIONAL, STAGES } from "../data/studioOffers";
import { Icon } from "../components/shared/icons/Icon";
import StudioEye from "../components/shared/StudioEye";

const INQUIRE_HREF = "/studio/inquire";
const FRACTIONAL_HREF = "/studio/inquire?service=fractional";
const ADMISSION_PAGE = "/studio/admission";
const CTA = "Tell me what isn’t working";

const NAV_LINKS = [
  { label: "Work", to: "/work" },
  { label: "Studio", to: "/studio", active: true },
  { label: "Admission", to: ADMISSION_PAGE },
  { label: "LaunchKit", href: "#launchkit" },
  { label: "Blog", to: "/observations" },
  { label: "About", to: "/about" },
];

const PROCESS = [
  { n: "01", title: "Tell me what isn’t working", desc: "A short inquiry form, then a free 20-minute fit call." },
  { n: "02", title: "Admission", desc: "A $500 diagnosis: what’s in the way, what to fix first, and a fixed quote." },
  { n: "03", title: "The work", desc: "The stage the diagnosis calls for, at the price it named." },
  { n: "04", title: "Handoff", desc: "What changed, why, what was left alone, and what to watch next." },
];

const PRINCIPLES = [
  { title: "Evidence", desc: "Every finding comes with proof: a screenshot, a number, or the exact step where it breaks. If I’m guessing, I’ll tell you." },
  { title: "Independence", desc: "You get steps you or your web person can take without me, and the diagnosis is written so you can act on it." },
  { title: "Hospitality", desc: "No pressure and no jargon. The diagnosis is yours whether we keep working together or not." },
];

const FAQ = [
  {
    q: "Why does every project start with a paid diagnosis?",
    a: "Because design work before we know what’s wrong is guessing. Admission finds what’s getting in the way and what to fix first. If you book the work within 30 days, the full $500 goes toward it.",
  },
  {
    q: "Why is there a price range?",
    a: "You get one fixed price after the diagnosis. The range only reflects how different the same symptom can turn out to be.",
  },
  {
    q: "What if I don’t continue after the diagnosis?",
    a: "You keep it. It’s written so you or your team can act on it.",
  },
  {
    q: "Can we keep measuring after launch?",
    a: "Yes. Every production ends with what to watch, and ongoing monitoring is available for past clients.",
  },
  {
    q: "I lead a product team. Do we need Admission too?",
    a: "No. Fractional Residency starts directly from a fit call, and the first two weeks act as the diagnosis.",
  },
];

// Studio's Selected Work slider. `cover` is the case-study screenshot shown
// in the card; the round badge shows /studio-logos/<id>.png (or `logo`)
// and falls back to a monogram until that file exists.
const WORK = [
  {
    id: "sultry-tips",
    label: "Brand Identity",
    title: "A nail brand without the clichés.",
    outcome: "Custom lettering for a Carrollton nail artist, still her mark two years later.",
    logoMark: "Sultry Tips",
    logoSub: "Nail artist · Carrollton, TX",
    cover: "sultry-hero",
    logo: "/studio-logos/sultry-tips.webp",
    monogram: "ST",
    to: "/sultry-tips",
  },
  {
    id: "athletico",
    logo: "/studio-logos/athletico.webp",
    label: "Healthcare",
    title: "Patient onboarding, reimagined.",
    outcome: "Clearer onboarding and appointment access for Athletico’s patient portal.",
    logoMark: "Athletico",
    logoSub: "Physical Therapy",
    cover: "athletico-overview",
    monogram: "A",
    to: "/athletico",
  },
  {
    id: "library-of-congress",
    label: "Enterprise Systems",
    title: "One shared interaction language.",
    outcome: "A unified UX architecture across the U.S. Copyright Office’s product ecosystem.",
    logoMark: "Library of Congress",
    logoSub: "U.S. Copyright Office",
    cover: "loc-users",
    monogram: "LC",
    to: "/library-of-congress",
  },
  {
    id: "house",
    label: "User Research",
    title: "Complexity made navigable.",
    outcome: "18+ interviews shaped a new committee-voting platform for the U.S. House.",
    logoMark: "U.S. House of Representatives",
    logoSub: "Committee Voting Platform",
    cover: "house-dashboard",
    monogram: "H",
    to: "/house",
  },
  {
    id: "usda",
    label: "Government",
    title: "One theme, many applications.",
    outcome: "A reusable, accessible theme connecting specialized workflows across USDA NASS applications.",
    logoMark: "USDA",
    logoSub: "National Agricultural Statistics Service",
    cover: "usda-admin",
    monogram: "U",
    to: "/usda",
  },
];

const LAUNCHKIT_SWATCHES = ["cream", "oxblood", "tint", "ink", "chrome"];

// The organizations Omoniyi Studio has actually delivered for — the names
// a prospective client recognizes and cares about, not the staffing
// vehicles behind the government placements.
const STUDIO_CLIENTS = ["USDA", "Library of Congress", "Athletico", "Birthright Africa", "Sultry Tips"];

function StudioNav() {
  return (
    <nav className="studio-nav" aria-label="Studio navigation">
      <div className="ecosystem-lockup"><BrandSignature space="studio" /><SpaceSwitcher space="studio" /></div>

      <div className="studio-nav__links">
        {NAV_LINKS.map(({ label, to, href, active }) =>
          to ? (
            <Link key={label} to={to} className={active ? "is-active" : ""}>
              {label}
            </Link>
          ) : (
            <a key={label} href={href} className={active ? "is-active" : ""}>
              {label}
            </a>
          )
        )}
      </div>

      <Button to={INQUIRE_HREF} variant="primary" className="studio-nav__cta">
        {CTA}
      </Button>
    </nav>
  );
}

function Hero() {
  return (
    <section className="studio-hero">
      <div className="studio-hero__grid">
        <div className="studio-hero__copy">
          <p className="studio-eyebrow">
            <span>Omoniyi Studio</span>
            <span className="studio-eyebrow__sub">An independent design practice by Omoniyi Alimi</span>
          </p>

          <h1 className="studio-hero__title">
            Your business
            <br />
            has taste.
            <br />
            <em>Your digital experience
              <br />
              should too.</em>
          </h1>

          <p className="studio-hero__description">
            I diagnose what isn’t working before I design anything, then design
            websites, products and systems for businesses ready to look, work
            and communicate at the level they’ve grown into.
          </p>

          <div className="studio-hero__actions">
            <Button to={INQUIRE_HREF} variant="primary">
              {CTA}
            </Button>
            <Button href="#production" variant="secondary" icon="arrow-down">
              How it works
            </Button>
          </div>

          <div className="studio-hero__annotation">
            <span>Strategy<br />Design<br />Systems<br />Results</span>
            <svg viewBox="0 0 60 80" className="studio-hero__annotation-arrow" fill="none" aria-hidden="true">
              <path d="M8 8 Q30 20 24 60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M18 54 L24 60 L30 52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="studio-hero__collage" aria-hidden="true">
          <div className="studio-hero__collage-main">
            <img
              src={studioHeroWindow}
              alt=""
            />
          </div>

          <div className="studio-hero__collage-side">
            <div className="studio-hero__note studio-hero__note--parchment">
              <p>Good<br />design<br />is good<br />hospitality.</p>
            </div>
            <div className="studio-hero__note studio-hero__note--tint">
              <p>Diagnose<br />first.<br />Then<br />design.</p>
            </div>
            <div className="studio-hero__collage-thumb">
              <img
                src={studioHeroCoffee}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className="studio-hero__strip">
        {["Clarity", "Trust", "Desire", "Conversion"].map((word, i) => (
          <span key={word}>
            {i > 0 && <em aria-hidden="true">/</em>}
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}

function ClientRollGroup({ hidden }) {
  return (
    <div className="studio-client-roll__group" aria-hidden={hidden || undefined}>
      {STUDIO_CLIENTS.map((name, i) => (
        <span className="studio-client-roll__item" key={name}>
          {i > 0 && <em aria-hidden="true">/</em>}
          {name}
        </span>
      ))}
    </div>
  );
}

function ClientRoll() {
  const [paused, setPaused] = useState(false);
  return (
    <section className={`studio-client-roll${paused ? " is-paused" : ""}`} aria-label="Contracted with">
      <div className="studio-client-roll__label">
        <p>Contracted with</p>
        <button type="button" className="studio-client-roll__pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
      <div className="studio-client-roll__track">
        <ClientRollGroup />
        <ClientRollGroup hidden />
      </div>
    </section>
  );
}

function Practice() {
  return (
    <section className="studio-section" id="practice">
      <div className="studio-section__row">
        <p className="studio-section__meta">01 / The Practice</p>
        <p className="studio-section__meta studio-section__meta--right">Diagnose first. Then design what the evidence justifies.</p>
      </div>

      <div className="studio-practice">
        <div className="studio-practice__intro">
          <h2>Good design is<br /><em>good hospitality.</em></h2>
          <p>
            I find out what’s really getting in the way before any design work starts, and I leave
            you more capable than I found you. You’ll understand what changed, why it changed, and
            what to do next.
          </p>
        </div>
        <ul className="studio-practice__list">
          {PRINCIPLES.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhatICheck() {
  return (
    <section className="studio-section" id="what-i-check">
      <div className="studio-section__row">
        <p className="studio-section__meta">03 / What I Check</p>
        <p className="studio-section__meta studio-section__meta--right">Every Admission, with proof</p>
      </div>

      <div className="studio-check">
        <div className="studio-check__intro">
          <h2>Before we fix anything, let’s find out <em>what’s actually wrong.</em></h2>
          <p>
            Eight things a customer feels, plus a ninth once I have your numbers. I use the same free
            tools the professionals use, then go through your site by hand, because tools alone miss
            a lot.
          </p>
          <Link to={ADMISSION_PAGE} className="studio-text-link">
            What Admission includes <Icon name="arrow-right" size={14} strokeWidth={1.5} />
          </Link>
        </div>
        <ol className="studio-check__grid">
          {CHECK_AREAS.map((item) => (
            <li key={item.n}>
              <span className="studio-check__n">{item.n}{item.note && <em> · {item.note}</em>}</span>
              <h3>{item.area}</h3>
              <p>{item.question}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProductTeams() {
  return (
    <section className="studio-section" id="product-teams">
      <div className="studio-section__row">
        <p className="studio-section__meta">05 / For Product Teams</p>
      </div>
      <div className="studio-team">
        <article className="studio-team__card">
          <div>
            <p className="studio-section__meta">{FRACTIONAL.sub}</p>
            <h3>{FRACTIONAL.name}</h3>
            <p className="studio-team__availability"><span aria-hidden="true" /> Now booking for October</p>
            <p className="studio-team__desc">{FRACTIONAL.description}</p>
            <p className="studio-team__includes">{FRACTIONAL.items.join(" · ")}</p>
          </div>
          <ul>
            {FRACTIONAL.plans.map((plan) => (
              <li key={plan.label}>{plan.label} <span>{plan.price}</span></li>
            ))}
            <li className="studio-team__terms">{FRACTIONAL.terms}</li>
          </ul>
          <Link to={FRACTIONAL_HREF} className="studio-tier__cta">
            Let’s talk about it <Icon name="arrow-right" size={15} strokeWidth={1.5} />
          </Link>
        </article>
      </div>
    </section>
  );
}

function Production() {
  return (
    <section className="studio-section" id="production">
      <div className="studio-section__row">
        <p className="studio-section__meta">06 / How a Production Runs</p>
        <p className="studio-section__meta studio-section__meta--right">One fixed quote, after the diagnosis</p>
      </div>

      <div className="studio-production__head">
        <h2>Every show has to<br /><em>start somewhere.</em></h2>
        <p>
          Ours starts with a diagnosis. Before any design work, I find out what’s really getting in
          the way. What comes next depends on what we find.
        </p>
      </div>

      <article className="studio-admission" aria-labelledby="admission-title">
        <div className="studio-admission__stub" aria-hidden="true">
          <StudioEye size={72} />
          <span>Admit one</span>
        </div>
        <div className="studio-admission__body">
          <p className="studio-admission__lead">It starts here</p>
          <div className="studio-tier__heading">
            <h3 id="admission-title">{ADMISSION.name}</h3>
            <div className="studio-tier__price">
              <span>Fixed</span>
              <strong>{ADMISSION.price}</strong>
            </div>
          </div>
          <p className="studio-tier__sub">{ADMISSION.sub}</p>
          <p className="studio-admission__desc">{ADMISSION.description}</p>
          <footer className="studio-tier__footer">
            <span>Delivered: <strong>{ADMISSION.timeline.toLowerCase()}</strong></span>
            <Link to={ADMISSION_PAGE} className="studio-tier__cta">
              What I check <Icon name="arrow-right" size={15} strokeWidth={1.5} />
            </Link>
          </footer>
        </div>
      </article>

      <p className="studio-production__then">Then, depending on what we find:</p>

      <div className="studio-tiers">
        {STAGES.map((stage) => (
          <article key={stage.id} className={`studio-tier studio-tier--${stage.tone}`}>
            <div className="studio-tier__heading">
              <h3>{stage.name}</h3>
              <div className="studio-tier__price">
                <span>{stage.id === "feature" ? "Total" : "Quoted fixed"}</span>
                <strong>{stage.price}</strong>
              </div>
            </div>

            <p className="studio-tier__sub">{stage.sub}</p>
            <hr />
            <p className="studio-tier__description">{stage.description}</p>

            <ul className="studio-tier__features">
              {stage.items.map((item) => (
                <li key={item}>
                  <Check size={13} strokeWidth={2.2} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <footer className="studio-tier__footer">
              <span>Timeline: <strong>{stage.timeline}</strong></span>
            </footer>
          </article>
        ))}
      </div>

      <p className="studio-production__note">
        Prices include the $500 Admission credit. A client who books The Feature pays $500, then $1,000.
      </p>

      <p className="studio-production__team">
        <strong>Working with a product team?</strong> Fractional design is available at 10 or 20 hours a
        week. <Link to={FRACTIONAL_HREF}>Let’s talk about it.</Link>
      </p>

      <div className="studio-house">
        <div>
          <h3>The House Promise</h3>
          <p>
            You’ll understand what changed, why it changed, and what to do next. I promise a clear
            process, not invented results: every finding comes with proof, and the price is fixed
            before the work starts.
          </p>
        </div>
        <div>
          <h3>Limited Seating</h3>
          <p>
            I take on a small number of productions at a time, so each one gets my full attention.
            Now booking for October.
          </p>
        </div>
      </div>

      <div className="studio-production__cta">
        <Button to={INQUIRE_HREF} variant="primary">{CTA}</Button>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="studio-section" id="process">
      <div className="studio-section__row">
        <p className="studio-section__meta">02 / The Process</p>
      </div>

      <div className="studio-process">
        <div className="studio-process__intro">
          <h2>Diagnose<br />first.<br />Then design.</h2>
          <span className="studio-hand">Strategy meets taste</span>
        </div>

        <div className="studio-process__steps">
          <div className="studio-process__line" aria-hidden="true" />
          <ol>
            {PROCESS.map((step) => (
              <li key={step.n}>
                <span className="studio-process__node">{step.n}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function LogoBadge({ id, logo, monogram }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`studio-work-card__badge studio-work-card__badge--${id}`} aria-hidden="true">
      {failed ? (
        <span className="studio-work-card__monogram">{monogram}</span>
      ) : (
        <img src={logo || `/studio-logos/${id}.png`} alt="" onError={() => setFailed(true)} />
      )}
    </span>
  );
}

function WorkCard({ id, label, title, outcome, logoMark, logoSub, cover, logo, monogram, to, hidden }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      className="studio-work-card"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="studio-work-card__frame">
        <img
          className="studio-work-card__shot"
          src={`/case-studies/${cover}.webp`}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ transform: hovered ? "scale(1.03)" : "scale(1)" }}
        />
        <div className="studio-work-card__overlay" data-hovered={hovered}>
          <p>{title}</p>
        </div>
      </div>
      <div className="studio-work-card__brand">
        <LogoBadge id={id} logo={logo} monogram={monogram} />
        <span>
          <span className="studio-work-card__logo-mark">{logoMark}</span>
          <span className="studio-work-card__logo-sub">{logoSub}</span>
        </span>
      </div>
      <p className="studio-work-card__label">{label}</p>
      <p className="studio-work-card__outcome">{outcome}</p>
    </Link>
  );
}

// Three cards on desktop, one on narrower screens.
function usePerView() {
  const query = "(max-width: 980px)";
  const [perView, setPerView] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(query).matches ? 1 : 3
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setPerView(mq.matches ? 1 : 3);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return perView;
}

function SelectedWork() {
  const perView = usePerView();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, WORK.length - perView);
  const current = Math.min(index, maxIndex);
  return (
    <section className="studio-section" id="work">
      <div className="studio-section__row">
        <p className="studio-section__meta">04 / Selected Work</p>
      </div>

      <div className="studio-work">
        <div className="studio-work__intro">
          <h2>Real businesses.<br />Real results.</h2>
          <p>A few examples of how thoughtful design creates measurable impact.</p>
          <Link to="/work" className="studio-text-link">
            View Case Studies <Icon name="arrow-right" size={14} strokeWidth={1.5} />
          </Link>
          <Link to="/visual" className="studio-text-link">
            Visual &amp; Illustration <Icon name="arrow-right" size={14} strokeWidth={1.5} />
          </Link>
          <div className="studio-work__controls">
            <button type="button" onClick={() => setIndex(current - 1)} disabled={current === 0} aria-label="Previous project">
              <Icon name="arrow-left" size={16} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => setIndex(current + 1)} disabled={current >= maxIndex} aria-label="Next project">
              <Icon name="arrow-right" size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="studio-work__viewport">
          <div className="studio-work__track" style={{ "--i": current }}>
            {WORK.map((item, i) => (
              <WorkCard key={item.id} {...item} hidden={i < current || i >= current + perView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  const [index, setIndex] = useState(0);
  const total = recommendations.length;
  const rec = recommendations[index];
  const go = (step) => setIndex((i) => (i + step + total) % total);

  return (
    <section className="studio-quote" aria-roledescription="carousel" aria-label="Recommendations">
      <div className="studio-quote__inner">
        <div className="studio-quote__top">
          <p className="studio-quote__mark" aria-hidden="true">
            “
          </p>
          {total > 1 && (
            <div className="studio-quote__controls">
              <button type="button" onClick={() => go(-1)} aria-label="Previous recommendation">
                <Icon name="arrow-left" size={16} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next recommendation">
                <Icon name="arrow-right" size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
        <div key={rec.name} className="studio-quote__slide" aria-live="polite">
          <p className="studio-quote__text">
            {rec.systems} {rec.closing}
          </p>
          <p className="studio-quote__cite">
            — {rec.name}, {rec.title} · {rec.relationship} ·{" "}
            <a href={rec.source} target="_blank" rel="noopener noreferrer">Read on LinkedIn</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Elsewhere() {
  return (
    <section className="studio-section studio-launchkit" id="launchkit">
      <div className="studio-section__row">
        <p className="studio-section__meta">Elsewhere in the Studio</p>
      </div>

      <div className="studio-launchkit__grid">
        <div className="studio-launchkit__copy">
          <p className="studio-elsewhere__label">Box Office · Tools you can use today</p>
          <h2>Not ready to hire<br />a studio? Start<br />with LaunchKit.</h2>
          <p>
            LaunchKit is my growing library of UI components, templates and
            resources for founders and designers who want to ship
            high-quality products, faster. It’s free.
          </p>
          <Link className="studio-text-link" to="/uikit">
            Explore LaunchKit <Icon name="arrow-right" size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="studio-launchkit__preview">
          <div className="studio-launchkit__card">
            <div className="studio-launchkit__card-header">
              <div>
                <p className="studio-launchkit__wordmark">LaunchKit</p>
                <p className="studio-launchkit__card-label">Design System Infrastructure</p>
              </div>
              <span className="studio-launchkit__glyph">Aa</span>
            </div>

            <div className="studio-launchkit__swatches">
              {LAUNCHKIT_SWATCHES.map((tone) => (
                <span key={tone} className={`studio-launchkit__swatch studio-launchkit__swatch--${tone}`} />
              ))}
            </div>

            <div className="studio-launchkit__components">
              <div className="studio-launchkit__component studio-launchkit__component--button">
                <p>Button</p>
                <span className="studio-launchkit__mock-button">Save changes <Icon name="arrow-right" size={14} strokeWidth={1.5} /></span>
              </div>
              <div className="studio-launchkit__component studio-launchkit__component--badge">
                <p>Badge</p>
                <span className="studio-launchkit__mock-badge">✦ In progress</span>
              </div>
              <div className="studio-launchkit__component studio-launchkit__component--switch">
                <p>Switch</p>
                <span className="studio-launchkit__mock-switch"><i /></span>
              </div>
              <div className="studio-launchkit__component studio-launchkit__component--metric">
                <p>Metric</p>
                <span className="studio-launchkit__mock-metric">
                  <strong>12</strong> Active projects
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className="studio-section" id="questions">
      <div className="studio-section__row">
        <p className="studio-section__meta">Questions</p>
      </div>
      <div className="studio-faq">
        <h2>Before you <em>ask.</em></h2>
        <div className="studio-faq__list">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudioFooter() {
  return (
    <footer className="studio-footer" id="contact">
      <div className="studio-footer__main">
        <div className="studio-footer__meta">
          <StudioEye size={40} className="studio-footer__eye" />
          <p className="studio-footer__wordmark">Omoniyi Studio</p>
          <p>Dallas, TX → Worldwide</p>
        </div>

        <div className="studio-footer__cta">
          <p className="studio-eyebrow studio-eyebrow--light">Ready when you are.</p>
          <h2>Tell me what<br />isn’t working.</h2>
        </div>

        <div className="studio-footer__actions">
          {/* The headline above already says the CTA, so the button names the step. */}
          <Button to={INQUIRE_HREF} variant="primary">
            Start your inquiry
          </Button>
          <Link className="studio-footer__link" to={ADMISSION_PAGE}>
            See what a diagnosis covers <Icon name="arrow-right" size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="studio-footer__bottom">
        <span>© 2026 Omoniyi Alimi / Omoniyi Studio</span>
        <div className="studio-footer__links">
          <Link to="/work">Work</Link>
          <Link to={ADMISSION_PAGE}>Admission</Link>
          <a href="#launchkit">LaunchKit</a>
          <Link to="/observations">Blog</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}

export default function Studio() {
  return (
    <div className="studio-page">
      <StudioNav />
      <main id="studio-main">
      <Hero />
      <ClientRoll />
      <Practice />
      <Testimonial />
      <Process />
      <WhatICheck />
      <SelectedWork />
      <ProductTeams />
      <Production />
      <Elsewhere />
      <Questions />
      </main>
      <StudioFooter />
    </div>
  );
}
