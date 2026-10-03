import { Link } from "react-router-dom";
import BrandSignature from "../components/shared/BrandSignature";
import SpaceSwitcher from "../components/shared/SpaceSwitcher";
import Button from "../components/shared/button/Button";
import StudioEye from "../components/shared/StudioEye";
import { Icon } from "../components/shared/icons/Icon";
import { CHECK_AREAS } from "../data/studioOffers";
import "./studio.css";
import "./studio-inquire.css";
import "./studio-admission.css";

// Admission: the $500 diagnosis. Copy from the "Admission: What I Check"
// doc (Oct 2026): specifics over jargon, honest about limits, one term
// ("diagnosis") throughout.
const INQUIRE_HREF = "/studio/inquire";
const CTA = "Tell me what isn’t working";

const GET = [
  "A written diagnosis, 2 to 4 pages, delivered within 5 business days",
  "A 45-minute call where I walk you through it",
  "What to fix first, what can wait, and what to leave alone",
  "Steps you or your web person can take without me",
  "A fixed quote if you want me to do the work",
];

const NOT_GET = [
  "A 40-page report you’ll never open again",
  "Promises about revenue or growth",
  "Design work before we know what’s wrong",
  "Pressure. The diagnosis is yours whether we keep working together or not.",
];

export default function StudioAdmission() {
  return (
    <div className="studio-page studio-admission-page">
      <nav className="studio-nav" aria-label="Admission navigation">
        <div className="ecosystem-lockup"><BrandSignature space="studio" /><SpaceSwitcher space="studio" /></div>
        <Link to="/studio" className="studio-inquire__back">
          <Icon name="arrow-left" size={14} strokeWidth={1.5} /> Back to Studio
        </Link>
      </nav>

      <main id="studio-main">
        <section className="studio-section admission-hero">
          <div className="admission-hero__copy">
            <p className="studio-eyebrow">
              <span>Admission</span>
              <span className="studio-eyebrow__sub">The diagnosis · $500</span>
            </p>
            <h1>Before we fix anything, let’s find out <em>what’s actually wrong.</em></h1>
            <p className="admission-hero__sub">
              Admission is a $500 diagnosis of your website. I look at it the way your customers do,
              then tell you in plain language what’s getting in the way and what to fix first.
            </p>
            <Button to={INQUIRE_HREF} variant="primary">{CTA}</Button>
          </div>
          <div className="admission-hero__ticket" aria-hidden="true">
            <StudioEye size={120} />
            <span>Admit one</span>
          </div>
        </section>

        <section className="studio-section" aria-labelledby="look-title">
          <div className="studio-section__row">
            <p className="studio-section__meta">What I look at</p>
            <p className="studio-section__meta studio-section__meta--right">1 to 8 from the outside · 9 with your numbers</p>
          </div>
          <h2 id="look-title" className="admission-h2">Nine questions your customers would never say out loud.</h2>
          <ol className="admission-areas">
            {CHECK_AREAS.map((item) => (
              <li key={item.n}>
                <span className="studio-check__n">{item.n}{item.note && <em> · {item.note}</em>}</span>
                <h3>{item.area}</h3>
                <p>{item.question}</p>
                <p className="admission-areas__why">{item.why}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="studio-section admission-split">
          <div>
            <p className="studio-section__meta">How I check</p>
            <h2 className="admission-h2">Tools catch some problems. People catch the rest.</h2>
          </div>
          <div className="admission-prose">
            <p>
              I use the same free tools the professionals use: Google Lighthouse, WAVE, Microsoft
              Accessibility Insights and Google Search Console. Then I go through your site by hand,
              with a keyboard, a screen reader and a phone, because tools alone miss a lot. In a UK
              government test, the best single tool found 41% of the problems on a page built to fail.
            </p>
            <p>
              Every finding comes with proof: a screenshot, a number, or the exact step where it
              breaks. If I’m guessing, I’ll tell you I’m guessing.
            </p>
          </div>
        </section>

        <section className="studio-section admission-split">
          <div>
            <p className="studio-section__meta">Why access matters</p>
            <h2 className="admission-h2">Most people who can’t use your site won’t tell you. They’ll just leave.</h2>
          </div>
          <div className="admission-prose">
            <p>
              In 2026, 95.9% of the top million home pages had accessibility failures a tool could
              catch. You’re not behind; this is common. But there’s no shortcut: in 2025 the FTC
              ordered accessiBe to pay $1 million for claiming its plug-in could make any website
              compliant. Real fixes are made in the site itself, and I’ll show you which ones matter
              first.
            </p>
            <p className="admission-sources">
              Sources: <a href="https://webaim.org/projects/million/" target="_blank" rel="noopener noreferrer">WebAIM Million</a>,{" "}
              <a href="https://www.ftc.gov/node/88115" target="_blank" rel="noopener noreferrer">FTC</a>,{" "}
              <a href="https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/" target="_blank" rel="noopener noreferrer">UK Government Digital Service</a>.
            </p>
          </div>
        </section>

        <section className="studio-section">
          <div className="admission-lists">
            <div>
              <h2 className="admission-h3">What you get</h2>
              <ul>
                {GET.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="admission-h3">What you won’t get</h2>
              <ul className="admission-lists__not">
                {NOT_GET.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="studio-section">
          <div className="admission-price">
            <p className="admission-price__amount">$500.</p>
            <p>If you book the work within 30 days, the full $500 goes toward it.</p>
            <Button to={INQUIRE_HREF} variant="primary">{CTA}</Button>
          </div>
        </section>
      </main>

      <footer className="studio-inquire__escape">
        <p>
          Prefer email? Write to <a href="mailto:contact@omoniyialimi.com">contact@omoniyialimi.com</a>.
        </p>
      </footer>
    </div>
  );
}
