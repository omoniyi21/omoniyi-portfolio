import BrandSignature from "../components/shared/BrandSignature";
import SpaceSwitcher from "../components/shared/SpaceSwitcher";
import studioHeroWindow from "../assets/images/studio-hero/window-table.jpg";
import studioHeroCoffee from "../assets/images/studio-hero/coffee.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, Check } from "lucide-react";

import Button from "../components/shared/button/Button";
import "./studio.css";

const INQUIRE_HREF = "/studio/inquire?service=not-sure";

const NAV_LINKS = [
  { label: "Work", to: "/work" },
  { label: "Studio", to: "/studio", active: true },
  { label: "LaunchKit", href: "#launchkit" },
  { label: "Blog", to: "/observations" },
  { label: "About", to: "/about" },
];

const TIERS = [
  {
    id: "refine",
    annotation: "Solve what’s\nnot working.",
    number: "01",
    name: "Refine",
    sub: "UX Audit & Optimization",
    price: "$950",
    description:
      "A focused engagement to fix a specific problem, improve conversion or upgrade a key page or flow.",
    items: [
      "UX audit & recommendations",
      "High-fidelity redesign (responsive)",
      "UX / copy suggestions",
      "Developer-ready handoff",
    ],
    timeline: "~ 1 week",
    tone: "light",
  },
  {
    id: "build",
    annotation: "Build for\ngrowth.",
    number: "02",
    name: "Build",
    sub: "Website / Product Design",
    price: "$3,500",
    description:
      "A complete website or core product experience designed to convert, communicate and scale with your business.",
    items: [
      "Strategy & UX",
      "UI design (4–6 pages or core flow)",
      "Responsive design",
      "Interactive prototype",
      "Mini component system",
    ],
    timeline: "~ 2–4 weeks",
    tone: "tint",
  },
  {
    id: "transform",
    annotation: "A system for\nwhat’s next.",
    number: "03",
    name: "Transform",
    sub: "Experience System & Creative Direction",
    price: "$6,500+",
    description:
      "For businesses that need a larger, more strategic solution — with a reusable design system and a long-term foundation.",
    items: [
      "Experience architecture",
      "Multiple workflows",
      "Design system (components + variables)",
      "Accessibility & responsive patterns",
      "Developer handoff + documentation",
    ],
    timeline: "~ 4–8 weeks",
    tone: "dark",
  },
];

const PROCESS = [
  { n: "01", title: "Diagnose", desc: "We define the problem, goals and opportunities." },
  { n: "02", title: "Design", desc: "We explore, design and refine the solution." },
  { n: "03", title: "Build / Handoff", desc: "You get polished, responsive designs ready for development." },
  { n: "04", title: "Improve", desc: "We measure, learn and continue to make it better." },
];

const WORK = [
  {
    label: "Healthcare",
    title: "Patient onboarding, reimagined.",
    outcome: "Clearer onboarding and appointment access for Athletico’s patient portal.",
    logoMark: "Athletico",
    logoSub: "Physical Therapy",
    frameTone: "light",
    to: "/athletico",
  },
  {
    label: "Enterprise Systems",
    title: "One shared interaction language.",
    outcome: "A unified UX architecture across the U.S. Copyright Office’s product ecosystem.",
    logoMark: "Library of Congress",
    logoSub: "U.S. Copyright Office",
    frameTone: "tint",
    to: "/library-of-congress",
  },
  {
    label: "User Research",
    title: "Complexity made navigable.",
    outcome: "18+ interviews shaped a new committee-voting platform for the U.S. House.",
    logoMark: "U.S. House of Representatives",
    logoSub: "Committee Voting Platform",
    frameTone: "chrome",
    to: "/house",
  },
];

const LAUNCHKIT_SWATCHES = ["cream", "oxblood", "tint", "ink", "chrome"];

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
        Start a Project
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
            We design websites, products and systems for businesses ready to
            look, work and communicate at the level they’ve grown into.
          </p>

          <div className="studio-hero__actions">
            <Button to={INQUIRE_HREF} variant="primary">
              Start a Project
            </Button>
            <Button href="#services" variant="secondary" icon={false}>
              See Packages <ArrowDown size={14} strokeWidth={1.8} />
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
            <span className="studio-hero__slide-count">0 / 5</span>
          </div>

          <div className="studio-hero__collage-side">
            <div className="studio-hero__note studio-hero__note--parchment">
              <p>Good<br />design<br />builds<br />stronger<br />businesses.</p>
            </div>
            <div className="studio-hero__note studio-hero__note--tint">
              <p>Beautiful<br />systems<br />for real<br />business<br />outcomes.</p>
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

function Services() {
  return (
    <section className="studio-section" id="services">
      <div className="studio-section__row">
        <p className="studio-section__meta">01 / Services</p>
        <p className="studio-section__meta studio-section__meta--right">
          Focused Packages. Measurable Impact.
        </p>
      </div>

      <div className="studio-tiers">
        {TIERS.map((tier) => (
          <article key={tier.id} className={`studio-tier studio-tier--${tier.tone}`}>
            <p className="studio-tier__annotation">{tier.annotation}</p>

            <div className="studio-tier__heading">
              <h3>{tier.name}</h3>
              <div className="studio-tier__price">
                <span>Starting at</span>
                <strong>{tier.price}</strong>
              </div>
            </div>

            <p className="studio-tier__sub">{tier.sub}</p>
            <hr />
            <p className="studio-tier__description">{tier.description}</p>

            <ul className="studio-tier__features">
              {tier.items.map((item) => (
                <li key={item}>
                  <Check size={13} strokeWidth={2.2} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <footer className="studio-tier__footer">
              <span>Timeline: <strong>{tier.timeline}</strong></span>
              <Link to={`/studio/inquire?service=${tier.id}`} className="studio-tier__cta">
                Inquire about this <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="studio-section" id="process">
      <div className="studio-section__row">
        <p className="studio-section__meta">02 / Our Process</p>
      </div>

      <div className="studio-process">
        <div className="studio-process__intro">
          <h2>A simple,<br />focused<br />process.</h2>
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

function WorkCard({ label, title, outcome, logoMark, logoSub, frameTone, to }) {
  const [hovered, setHovered] = useState(false);
  const frameClassName =
    frameTone && frameTone !== "light"
      ? `studio-work-card__frame studio-work-card__frame--${frameTone}`
      : "studio-work-card__frame";
  return (
    <Link
      to={to}
      className="studio-work-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={frameClassName}>
        <div className="studio-work-card__logo" style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}>
          <span className="studio-work-card__logo-mark">{logoMark}</span>
          <span className="studio-work-card__logo-sub">{logoSub}</span>
        </div>
        <div className="studio-work-card__overlay" data-hovered={hovered}>
          <p>{title}</p>
        </div>
      </div>
      <p className="studio-work-card__label">{label}</p>
      <p className="studio-work-card__outcome">{outcome}</p>
    </Link>
  );
}

function SelectedWork() {
  return (
    <section className="studio-section" id="work">
      <div className="studio-section__row">
        <p className="studio-section__meta">03 / Selected Work</p>
      </div>

      <div className="studio-work">
        <div className="studio-work__intro">
          <h2>Real businesses.<br />Real results.</h2>
          <p>A few examples of how thoughtful design creates measurable impact.</p>
          <Link to="/work" className="studio-text-link">
            View Case Studies <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>

        <div className="studio-work__grid">
          {WORK.map((item) => (
            <WorkCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="studio-quote">
      <div className="studio-quote__inner">
        <p className="studio-quote__mark" aria-hidden="true">
          “
        </p>
        <p className="studio-quote__text">
          The most helpful healthcare experiences make the next step feel obvious — without making
          the person taking it feel rushed.
        </p>
        <p className="studio-quote__cite">— Omoniyi Alimi, on redesigning Athletico’s patient onboarding</p>
      </div>
    </section>
  );
}

function LaunchKit() {
  return (
    <section className="studio-section studio-launchkit" id="launchkit">
      <div className="studio-section__row">
        <p className="studio-section__meta">04 / LaunchKit</p>
      </div>

      <div className="studio-launchkit__grid">
        <div className="studio-launchkit__copy">
          <h2>I don’t just design<br />systems for clients.<br />I build them.</h2>
          <p>
            LaunchKit is my growing library of UI components, templates and
            resources for designers and builders who want to ship
            high-quality products, faster.
          </p>
          <Link className="studio-text-link" to="/uikit">
            Explore LaunchKit <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
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
                <span className="studio-launchkit__mock-button">Save changes →</span>
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

function StudioFooter() {
  return (
    <footer className="studio-footer" id="contact">
      <div className="studio-footer__main">
        <div className="studio-footer__meta">
          <p className="studio-footer__wordmark">Omoniyi Studio</p>
          <p>Dallas, TX → Worldwide</p>
        </div>

        <div className="studio-footer__cta">
          <p className="studio-eyebrow studio-eyebrow--light">Ready when you are.</p>
          <h2>Tell me what<br />isn’t working.</h2>
        </div>

        <div className="studio-footer__actions">
          <Button to={INQUIRE_HREF} variant="primary">
            Start a Project
          </Button>
          <Link className="studio-footer__link" to={INQUIRE_HREF}>
            Not sure what you need? Let’s talk it through. →
          </Link>
        </div>
      </div>

      <div className="studio-footer__bottom">
        <span>© 2026 Omoniyi Alimi / Omoniyi Studio</span>
        <div className="studio-footer__links">
          <Link to="/work">Work</Link>
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
      <Services />
      <Process />
      <SelectedWork />
      <Testimonial />
      <LaunchKit />
      </main>
      <StudioFooter />
    </div>
  );
}
