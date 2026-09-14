import { Link } from "react-router-dom";
import "./process-section.css";
import FloatingSD from "../../assets/branding/celestial/stardust-asteroid.png";

// The five words from the hero's old constellation, now written out: how I
// actually think through each stage, each tied to the real project that
// shows it best.
const STEPS = [
  {
    word: "Discover",
    body: "I start by mapping the mess — who's affected, what's actually broken, and where the real constraints live before I touch a screen.",
    client: "U.S. House",
    note: "Committee Voting Platform",
    to: "/house",
  },
  {
    word: "Define",
    body: "Then I turn research into a shared framework: the rules, patterns, and language a whole team can build from.",
    client: "U.S. Copyright Office",
    note: "Enterprise UX Architecture",
    to: "/library-of-congress",
  },
  {
    word: "Design",
    body: "I prototype in context, testing against real edge cases and real users — not just the happy path.",
    client: "USDA NASS",
    note: "Enterprise Application Modernization",
    to: "/usda",
  },
  {
    word: "Develop",
    body: "I stay close to engineering so what ships matches what was designed — sometimes I build the system myself.",
    client: "LaunchKit UI",
    note: "My own product, shipped",
    to: "/uikit",
  },
  {
    word: "Deliver",
    body: "I care about the moment someone actually uses it: is it clear, is it fast, does it feel like it was made for them?",
    client: "Athletico",
    note: "Patient Onboarding & Scheduling",
    to: "/athletico",
  },
];

export default function ProcessSection() {
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
          The same arc shows up in every project I take on — just aimed at a different problem each time.
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
          <li className="process-card" key={step.word}>
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
