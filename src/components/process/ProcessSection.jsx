import { useState } from "react";
import { Link } from "react-router-dom";
import "./process-section.css";
import FloatingSD from "../../assets/branding/celestial/stardust-asteroid.webp";
import houseMockup from "../../assets/images/how-i-think/house.webp";
import locMockup from "../../assets/images/how-i-think/loc-search.webp";
import usdaMockup from "../../assets/images/how-i-think/usda.webp";
import launchkitMockup from "../../assets/images/how-i-think/launchkit.webp";
import athleticoMockup from "../../assets/images/how-i-think/athletico.webp";

// The five words from the hero's old constellation, now written out: how I
// actually think through each stage, each tied to the real project that
// shows it best. Hovering, focusing or tapping a card slides that project's
// device mockup up out from behind it, like a photo pulled from a sleeve.
const STEPS = [
  {
    word: "Discover",
    body: "Before I open Figma, I want to know who this is for, what's actually broken, and which rules I can't bend. On the House project that meant 18 interviews and sitting with leadership three times a week.",
    client: "U.S. House",
    note: "Moving committee votes from paper to one digital record",
    to: "/house",
    mockup: houseMockup,
    shape: "phone",
  },
  {
    word: "Define",
    body: "Then I give everyone the same language. Research turns into patterns a whole team can build from, so search works one way across every product instead of eight different ways.",
    client: "U.S. Copyright Office",
    note: "One way to search, filter and navigate across a federal product family",
    to: "/library-of-congress",
    mockup: locMockup,
    shape: "laptop",
  },
  {
    word: "Design",
    body: "I design for the messy cases, not the happy path. Long names, empty states, someone checking it on their phone. If it only works in the demo, it doesn't work.",
    client: "USDA NASS",
    note: "One accessible theme for a family of agency tools",
    to: "/usda",
    mockup: usdaMockup,
    shape: "phone",
  },
  {
    word: "Develop",
    body: "I stay close to the code. Sometimes that means working side by side with engineers, and sometimes it means building it myself. LaunchKit is the proof. I designed it and I shipped it.",
    client: "LaunchKit UI",
    note: "My own product, shipped",
    to: "/uikit",
    mockup: launchkitMockup,
    shape: "laptop",
  },
  {
    word: "Deliver",
    body: "The real test is the moment someone uses it. Is it clear? Does it feel made for them? For Athletico, that was patients filling out their medical history before a first visit, tested with about 100 people.",
    client: "Athletico",
    note: "Making the first step of care easier to take",
    to: "/athletico",
    mockup: athleticoMockup,
    shape: "phone",
  },
];

export default function ProcessSection() {
  // Touch screens have no hover, so a tap on the card (outside its link)
  // opens that card's mockup. One open at a time.
  const [open, setOpen] = useState(null);

  return (
    <section className="process-section" aria-labelledby="process-title">
      <div className="process-section__opening">
      <header className="process-section__head">
        <p className="process-section__eyebrow">
          <span>How I Think</span>
          <span aria-hidden="true">✦</span>
        </p>
        <h2 id="process-title">Five steps, one way of thinking.</h2>
        <p className="process-section__intro">
          The problem changes every time. How I work through it doesn’t.
        </p>
      </header>
      <div className="process-section__sd" tabIndex={0} aria-describedby="process-sd-tooltip">
        <img src={FloatingSD} alt="Stardust floating" />
        <a href="https://www.figma.com/design/ZdQgGWYa2JVXtn57IIMShQ/Stardust---Dust---Notebook-%E2%80%94-Theme-History---Foundations" target="_blank" rel="noopener noreferrer" className="process-section__figma" aria-describedby="process-sd-tooltip">peek into figma <span aria-hidden="true">↗</span></a>
        <span className="process-section__sd-tooltip" id="process-sd-tooltip" role="tooltip">I'm Stardust or SD, peek into figma to get to know me</span>
      </div>
      </div>

      <ol className="process-section__grid">
        {STEPS.map((step, index) => (
          <li
            className={`process-card process-card--${step.shape}${open === index ? " is-open" : ""}`}
            key={step.word}
            onClick={(event) => {
              if (event.target.closest("a")) return;
              setOpen((current) => (current === index ? null : index));
            }}
          >
            <span className="process-card__mockup" aria-hidden="true">
              <img src={step.mockup} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="process-card__number">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="process-card__word">{step.word}</h3>
            <p className="process-card__body">{step.body}</p>
            <Link className="process-card__link" to={step.to}>
              <span className="process-card__client">{step.client}</span>
              <i className="process-card__note">{step.note}</i>
              <span aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
