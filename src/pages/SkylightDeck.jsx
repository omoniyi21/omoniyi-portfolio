import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import floating from "../assets/branding/celestial/stardust-asteroid.webp";
import thinking from "../assets/branding/sd-variants/sd-thinking.webp";
import sleeping from "../assets/branding/sd-variants/sd-sleeping.webp";
import exploring from "../assets/branding/sd-variants/sd-exploring.webp";
import "./skylight-deck.css";

// Unlisted interview deck for Skylight (U.S. Air Force). Not linked from the
// site, left out of the sitemap, and served with noindex (see pageMetadata.js
// and public/_headers). Slides are drawn on a fixed 1920x1080 stage and scaled
// to fit, so the layout holds on any screen share. Every claim here comes from
// the published case studies; outcomes stay as modest as those pages are.

const SD = { floating, thinking, sleeping, exploring };
const HOUSE_PROTOTYPE = "https://www.figma.com/proto/hn1KPlUQVOIlVMKbz1id6I?node-id=151-3362&starting-point-node-id=151-3362";
// Same path rule as the case study pages: accounting screens are blurred copies.
const shotSrc = (name) => `/case-studies/${name}.webp${name.startsWith("payments-") ? "?redacted=1" : ""}`;

const Kicker = ({ children }) => <p className="deck__kicker">{children}</p>;
const H = ({ children, size = 104 }) => <h2 className="deck__h" style={{ fontSize: size }}>{children}</h2>;
const Lede = ({ children }) => <p className="deck__text">{children}</p>;
const Points = ({ items }) => (
  <div className="deck__points">
    {items.map(([n, t]) => (
      <div key={n} className="deck__point">
        <p className="deck__point-n">{n}</p>
        <p className="deck__point-t">{t}</p>
      </div>
    ))}
  </div>
);
const Flow = ({ from, to }) => (
  <div className="deck__flow">
    <span className="deck__flow-from">{from}</span>
    <span className="deck__flow-arrow" aria-hidden="true">→</span>
    <span className="deck__flow-to">{to}</span>
  </div>
);
const Shot = ({ name, caption, tall = false }) => (
  <figure className={`deck__shot${tall ? " deck__shot--tall" : ""}`}>
    <img src={shotSrc(name)} alt={caption} decoding="async" />
    <figcaption>{caption}{name.startsWith("payments-") && <strong> Data blurred for confidentiality.</strong>}</figcaption>
  </figure>
);
const Split = ({ children, media }) => (
  <div className="deck__split">
    <div className="deck__split-copy">{children}</div>
    <div className="deck__split-media">{media}</div>
  </div>
);
// Wide legacy screens (3:1 to 15:1) read best as a full-width band under the copy.
const Band = ({ head, side, media }) => (
  <div className="deck__band">
    <div className="deck__band-copy">
      <div>{head}</div>
      <div>{side}</div>
    </div>
    <div className="deck__band-media">{media}</div>
  </div>
);
const Facts = ({ items }) => (
  <dl className="deck__facts">
    {items.map(([k, v]) => (
      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
    ))}
  </dl>
);
const Stack = ({ items }) => (
  <div className="deck__stack">
    {items.map(([a, b]) => (
      <div key={a} className="deck__stack-item">
        <p className="deck__stack-a">{a}</p>
        <p className="deck__stack-b">{b}</p>
      </div>
    ))}
  </div>
);
const Learned = ({ rows }) => (
  <div className="deck__learned" role="table" aria-label="Observation, principle and product response">
    <div className="deck__learned-row deck__learned-head" role="row">
      {["What we saw", "Principle", "What the product did"].map((h) => <p key={h} role="columnheader">{h}</p>)}
    </div>
    {rows.map((r) => (
      <div key={r[0]} className="deck__learned-row" role="row">
        {r.map((c) => <p key={c} role="cell">{c}</p>)}
      </div>
    ))}
  </div>
);
const Pause = ({ story }) => (<>
  <Kicker>{story}</Kicker>
  <H size={150}>Questions on<br /><em className="deck__accent">this one?</em></H>
  <p className="deck__lede">Before we move on.</p>
</>);

const slides = [
  {
    title: "Introduction", section: "Skylight · Senior/Staff Product Designer", sd: "floating", pos: "br",
    notes: ["Thank Mike for the time; frame the hour.", "Two deep stories, a pause for questions after each, then open conversation."],
    body: (<>
      <Kicker>Skylight · U.S. Air Force</Kicker>
      <H size={150}>Designing for the<br /><em className="deck__accent">operational</em> reality.</H>
      <p className="deck__lede">Omoniyi Alimi, Senior Product Designer</p>
    </>),
  },
  {
    title: "Agenda", section: "Today", sd: "exploring", pos: "tr",
    notes: ["Say the positioning line out loud, then the agenda.", "\"Interrupt me anytime. I'll also pause after each story.\""],
    body: (<>
      <Kicker>Today</Kicker>
      <H size={80}>I design for systems where the information is dense, the stakes are high, and the next step has to be right.</H>
      <ol className="deck__agenda">
        {["U.S. Copyright Office: Accounting discovery", "U.S. House: Committee voting platform", "How I'd work at Skylight", "Conversation"].map((t, i) => (
          <li key={t}>
            <span className="deck__agenda-n">0{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </>),
  },

  // Story 1: Copyright Office accounting (15 to 18 min)
  {
    title: "Accounting: Context", section: "01 · U.S. Copyright Office",
    notes: ["Modernizing accounting meant learning how payments, deposit accounts, registrations and staff actions relate.", "The legacy interface wasn't just old. It held years of operational requirements.", "About 2 minutes."],
    body: (<Band
      head={<><Kicker>01 · U.S. Copyright Office</Kicker><H size={68}>Understanding the accounting rules before redesigning them</H></>}
      side={<Facts items={[["Role", "UX Designer, Accounting Discovery"], ["Team", "Product, accounting SMEs, engineering, QA"], ["I owned", "SME research, legacy analysis, workflow mapping, requirements, product modeling"]]} />}
      media={<Shot name="payments-legacy" caption="The starting point: legacy Siebel account, transaction and payment-allocation views." />}
    />),
  },
  {
    title: "Accounting: Problem", section: "01 · U.S. Copyright Office",
    notes: ["Different payment paths, account rules and unresolved transactions created dependencies beyond any one form.", "Staff needed to understand both the record and its consequences."],
    body: (<Band
      head={<><Kicker>01 · The problem</Kicker><H size={76}>A payment is more than an amount.</H></>}
      side={<Stack items={[["Multiple entry paths", "Paper checks, online payments and other service paths needed different handling."], ["Account lifecycle rules", "Balances, reminders, closure and inactivation shaped what could happen next."], ["Exceptions crossed boundaries", "Failed postings and unpaid records needed investigation across linked records."]]} />}
      media={<Shot name="payments-transactions" caption="Transactions carry balances, identifiers, posting status and comments in one view." />}
    />),
  },
  {
    title: "Accounting: Its own room", section: "01 · U.S. Copyright Office", sd: "thinking", pos: "br",
    notes: ["Say this one plainly. It's influence beyond the screens.", "Accounting was being folded into the admin workspace. I coordinated the stakeholder conversations and made the case for its own workspace.", "Be ready with who you convinced and how."],
    body: (<>
      <Kicker>01 · Making the case</Kicker>
      <H size={88}>Giving accounting its own room</H>
      <Flow from="Folded into the admin workspace" to="Its own workspace and team" />
      <Points items={[["Team", "A dedicated accounting track"], ["2×", "SME sessions coordinated every week"], ["Weekly", "Design-decision touchpoint"]]} />
    </>),
  },
  {
    title: "Accounting: How the work ran", section: "01 · U.S. Copyright Office",
    notes: ["Follow the records and the handoffs.", "SMEs showed when payment records were created, what was already automated, and where accounting depended on other service units.", "I paired that with legacy analysis before proposing any interface change."],
    body: (<Band
      head={<><Kicker>01 · How the work ran</Kicker><H size={76}>Follow the records and the handoffs.</H></>}
      side={<><Lede>Over 2.5 months of discovery, SME sessions showed when payment records were created, which rules were already automated, and where accounting depended on other service units.</Lede><Lede>I paired that with legacy analysis before proposing any interface change.</Lede></>}
      media={<div className="deck__band-pair"><Shot name="payments-balance" caption="Deposit-account summary: balance and account type as context." /><Shot name="payments-journal" caption="Account journal and record detail." /></div>}
    />),
  },
  {
    title: "Accounting: Deconstructing Siebel", section: "01 · U.S. Copyright Office",
    notes: ["Walk one real workflow that was hard to untangle: a payment, its allocation, and the fees and service requests it links to.", "Show how mapping the dependencies changed what the team decided."],
    body: (<Band
      head={<><Kicker>01 · Making sense of legacy</Kicker><H size={76}>Deconstructing Siebel</H></>}
      side={<Stack items={[["Deconstruct", "Legacy Siebel workflows, step by step"], ["Model", "Payments, allocations, fees and service requests, made visible"], ["Decide", "What the new product must keep before anything gets simpler"]]} />}
      media={<Shot name="payments-allocation" caption="Payment allocation links a payment to downstream fees and service-request identifiers." />}
    />),
  },
  {
    title: "Accounting: What research changed", section: "01 · U.S. Copyright Office",
    notes: ["This is the heart of the story. Spend about 3 minutes.", "Line to land: \"Research stopped us from building something that already existed.\""],
    body: (<>
      <Kicker>01 · What research changed</Kicker>
      <H size={76}>A missing cue is not a missing capability.</H>
      <Learned rows={[
        ["SMEs confirmed low-balance reminders already existed.", "Check operational behavior before proposing automation.", "Prioritize account visibility instead of another reminder."],
        ["Some physical-payment paths needed manual record creation.", "Expose actions where the workflow and role require them.", "Manual creation became a scoped requirement, not a global action."],
        ["A failed posting had consequences a short status couldn't explain.", "Keep exception context beside the record.", "Status, comments and linked records stay together."],
      ]} />
    </>),
  },
  {
    title: "Accounting: Decisions", section: "01 · U.S. Copyright Office",
    notes: ["The tradeoff: everyone wanted a simpler screen, but a cleaner screen still had to support investigation.", "Add one thing you'd do differently (yours to fill)."],
    body: (<Band
      head={<><Kicker>01 · Decisions and the tradeoff</Kicker><H size={68}>Simplify the model without losing the rules.</H><p className="deck__callout"><strong>Tradeoff.</strong> A cleaner screen still had to support investigation.</p></>}
      side={<Stack items={[["Keep account health close", "Balance and account type as decision context"], ["Retain traceability", "Transactions, allocations and service records stay linked"], ["Explain exceptions", "A payment state travels with what explains it"]]} />}
      media={<Shot name="payments-exception" caption="Posting failures and fee adjustments appear alongside transaction state." />}
    />),
  },
  {
    title: "Accounting: Outcome", section: "01 · U.S. Copyright Office", sd: "exploring", pos: "br",
    notes: ["Be honest about scope: structured discovery and clear requirements, not a shipped replacement.", "Bridge: \"Air Force systems carry the same thing: rules that live in old screens and in people's heads. This is how I find them before we change anything.\""],
    body: (<>
      <Kicker>01 · Outcome</Kicker>
      <H size={80}>A stronger foundation for the next product decision</H>
      <Points items={[["People", "SME knowledge became explicit input to product decisions"], ["Product", "Clarity on manual payments, existing reminders and exceptions"], ["System", "Records, lifecycle rules, permissions and handoffs in the model"]]} />
      <p className="deck__quote">“Understanding what should stay is as important as deciding what should change.”</p>
    </>),
  },
  {
    title: "Questions: Copyright Office", section: "01 · U.S. Copyright Office", sd: "thinking", pos: "br",
    notes: ["Aim for 5 to 8 minutes.", "Likely: getting access to users, SME disagreement, what to keep from the legacy system."],
    body: <Pause story="01 · Pause" />,
  },

  // Story 2: U.S. House voting platform (15 to 18 min)
  {
    title: "House: Context", section: "02 · U.S. House of Representatives",
    notes: ["A 0-to-1 product for high-stakes users, from research to a working prototype and the system behind it."],
    body: (<Split media={<Shot name="house-dashboard" caption="Committee Referrals: the shared starting point for legislative activity." tall />}>
      <Kicker>02 · U.S. House of Representatives</Kicker>
      <H size={68}>Moving committee votes from paper to one digital record</H>
      <Facts items={[["Role", "UI/UX Designer, 2024 to 2025"], ["Team", "PM, engineers, QA, House leadership, SMEs"], ["I owned", "Research, workflows, prototypes, design system, specs, user stories and acceptance criteria"]]} />
      <div className="deck__chips">{["0 → 1 product", "3× a week with leadership", "30+ USWDS components"].map((t) => <span key={t}>{t}</span>)}</div>
    </Split>),
  },
  {
    title: "House: Problem", section: "02 · U.S. House of Representatives",
    notes: ["Committee vote information had been collected and displayed inconsistently.", "The product had to keep the rules and records behind the work while giving staff a clear starting point."],
    body: (<Band
      head={<><Kicker>02 · The problem</Kicker><H size={76}>Find. Understand. Act. Complete.</H><Lede>Committee vote information had been collected and displayed inconsistently.</Lede></>}
      side={<Stack items={[["Locate the right referral", "A central list with useful filters and recognizable bill records"], ["Keep context available", "Sponsors, dates and referral history during decisions"], ["Make the action explicit", "Committee rules as clear choices, without losing the official record"]]} />}
      media={<Shot name="house-filters" caption="Committee and date filters narrow the referral list." />}
    />),
  },
  {
    title: "House: Listening first", section: "02 · U.S. House of Representatives",
    notes: ["Who was interviewed: committee leadership and clerks.", "Live prototypes surfaced business rules and missing requirements that interviews alone didn't."],
    body: (<Split media={<><Shot name="house-table" caption="Bill numbers, titles and dates give each referral a recognizable place." /><Shot name="house-context" caption="The Referral Brief at the point of review." /></>}>
      <Kicker>02 · Listening first</Kicker>
      <div className="deck__stat deck__stat--compact">
        <p className="deck__stat-n">~18</p>
        <p className="deck__stat-t">interviews across two research rounds</p>
      </div>
      <Lede>Plus recurring leadership sessions and live prototypes that exposed business rules and missing requirements.</Lede>
    </Split>),
  },
  {
    title: "House: What I learned", section: "02 · U.S. House of Representatives",
    notes: ["Three recurring needs shaped the interaction model. About 3 minutes."],
    body: (<>
      <Kicker>02 · What I learned</Kicker>
      <H size={76}>Clarity comes from keeping context close.</H>
      <Learned rows={[
        ["Staff needed legislative info while completing tasks.", "Keep decision support inside the workflow.", "The Referral Brief opens beside the referral list."],
        ["Voting rules had meaningful choices and exceptions.", "Organize actions into understandable sections.", "Roll-call details separate meeting context, outcome and each member's choice."],
        ["Users first had to identify and understand a bill.", "Create a clear operational starting point.", "Committee Referrals combines filters, records and detail access."],
      ]} />
    </>),
  },
  {
    title: "House: Decisions", section: "02 · U.S. House of Representatives",
    notes: ["Principles: zero-error under pressure, high-density data, context close, USWDS extended.", "Add one thing you'd do differently (yours to fill)."],
    body: (<Split media={<Shot name="house-brief" caption="The brief overlays the list, keeping the task and its context connected." tall />}>
      <Kicker>02 · Decisions and the tradeoff</Kicker>
      <H size={68}>Zero-error, under pressure</H>
      <Stack items={[["A focused place per stage", "Referrals, roster and voting as separate modules, not one long form"], ["Bring the brief to the decision", "Legislative detail stays next to the action"], ["Let staff tune the table", "Dense records stay inspectable on a shared data model"]]} />
      <p className="deck__callout"><strong>Tradeoff.</strong> A denser view, balanced by a focused overlay and a clear way back.</p>
    </Split>),
  },
  {
    title: "House: Prototype", section: "02 · U.S. House of Representatives",
    notes: ["Walk it: find a referral, open its brief, record a roll-call vote. Data is illustrative.", "If the prototype won't load, stay on this slide and narrate from the screen."],
    body: (<Split media={<Shot name="house-vote" caption="Roll-call context, tally and voting controls in one view." tall />}>
      <Kicker>02 · The experience</Kicker>
      <H size={76}>One product, three connected jobs.</H>
      <ol className="deck__steps">
        {["Find and review referrals", "Maintain the committee roster", "Record a roll-call vote"].map((t) => <li key={t}>{t}</li>)}
      </ol>
      <a className="deck__link" href={HOUSE_PROTOTYPE} target="_blank" rel="noopener noreferrer">Open the working prototype ↗</a>
      <p className="deck__small">Figma prototype. Data shown is illustrative.</p>
    </Split>),
  },
  {
    title: "House: The system", section: "02 · U.S. House of Representatives",
    notes: ["Figma specs, Azure DevOps stories and acceptance criteria carried decisions into engineering.", "Accessibility: built on USWDS, with explicit Yea, Nay and Present choices. Mention your WCAG 2.1 AA practice (NVDA, JAWS, WAVE)."],
    body: (<Split media={<Shot name="house-design-system" caption="The component sheet: 18 of the 30+ components." tall />}>
      <Kicker>02 · The system behind it</Kicker>
      <H size={76}>A shared language for future committee work</H>
      <Stack items={[["30+ components", "USWDS-based filters, tables, forms, navigation and voting"], ["Carried into engineering", "Figma specs, Azure DevOps stories and acceptance criteria"], ["Accessible by default", "Explicit Yea, Nay and Present choices for every member"]]} />
    </Split>),
  },
  {
    title: "House: Outcome", section: "02 · U.S. House of Representatives", sd: "exploring", pos: "br",
    notes: ["No post-launch efficiency metric is claimed.", "Say: when I left, two committees were the test group for the rollout."],
    body: (<>
      <Kicker>02 · Outcome</Kicker>
      <H size={80}>A clearer model of legislative work</H>
      <Points items={[["People", "Staff and SMEs shaped how referrals are found, reviewed and voted on"], ["Product", "Referrals, rosters and roll-call records in one experience"], ["Rollout", "Two committees were the test group when I left"]]} />
      <p className="deck__quote">“My role was not to make legislative work simple. It was to make its complexity navigable.”</p>
    </>),
  },
  {
    title: "Questions: House", section: "02 · U.S. House of Representatives", sd: "thinking", pos: "br",
    notes: ["Aim for 5 to 8 minutes.", "Likely: engineering handoff, when to extend USWDS, accessibility and Section 508."],
    body: <Pause story="02 · Pause" />,
  },

  {
    title: "How I'd work at Skylight", section: "03 · Skylight & the Air Force", sd: "exploring", pos: "br",
    notes: ["One beat on how you work now (30 seconds): \"I stay close to the code. LaunchKit is a product I designed and shipped, and I prototype with AI tools to get to something testable faster.\""],
    body: (<>
      <Kicker>03 · Skylight &amp; the Air Force</Kicker>
      <H size={88}>Leave teams more capable</H>
      <div className="deck__trio">
        {[
          ["Build capacity", "Onboarded a colleague onto the design system, ran a search-component audit and presented it together. Design reviews and a UX forum kept teams aligned."],
          ["Ground the work", "SME cadence, legacy analysis and leadership sessions three times a week. I learn the rules before I change the screens."],
          ["Hand off stronger", "Specs, user stories with acceptance criteria, documented component behavior and shared Figma and Angular libraries."],
        ].map(([a, b]) => (
          <div key={a} className="deck__trio-item">
            <p className="deck__trio-a">{a}</p>
            <p className="deck__trio-b">{b}</p>
          </div>
        ))}
      </div>
    </>),
  },
  {
    title: "Thank you", section: "Conversation", sd: "sleeping", pos: "br",
    notes: ["Open the floor.", "Ask two or three: who the Air Force users are and how much access the team has; what the design team looks like; the hardest design problem on the contract; a strong first 90 days."],
    body: (<>
      <Kicker>Conversation</Kicker>
      <H size={170}>Thank you.</H>
      <p className="deck__closing">Questions, tangents, and good films welcome.</p>
      <p className="deck__url">omoniyialimi.com</p>
    </>),
  },
];

// Every screenshot in the deck, so they can load ahead of the slides that use them.
const allShots = ["payments-legacy", "payments-transactions", "payments-balance", "payments-journal", "payments-allocation", "payments-exception", "house-dashboard", "house-filters", "house-table", "house-context", "house-brief", "house-vote", "house-design-system"];

function useStageScale(ref) {
  const [scale, setScale] = useState(0.5);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

export default function SkylightDeck() {
  const [params, setParams] = useSearchParams();
  const total = slides.length;
  const idx = Math.min(Math.max(Number(params.get("slide")) || 1, 1), total) - 1;
  const [notes, setNotes] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const stageRef = useRef(null);
  const scale = useStageScale(stageRef);
  const touchX = useRef(null);

  const go = useCallback((i) => {
    const n = Math.min(Math.max(i, 0), total - 1);
    setParams({ slide: String(n + 1) }, { replace: true });
  }, [setParams, total]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); go(idx + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(idx - 1); }
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "n" || e.key === "N") setNotes((v) => !v);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
    };
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [go, idx, toggleFullscreen, total]);

  useEffect(() => {
    const imgs = allShots.map((name) => { const img = new Image(); img.src = shotSrc(name); return img; });
    return () => imgs.forEach((img) => { img.src = ""; });
  }, []);

  const slide = slides[idx];
  return (
    <main className="deck" aria-label="Skylight interview deck">
      <div
        ref={stageRef}
        className="deck__viewport"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1);
          touchX.current = null;
        }}
      >
        <section
          className="deck__stage"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          aria-roledescription="slide"
          aria-label={`${idx + 1} of ${total}: ${slide.title}`}
        >
          <header className="deck__running">
            <span>Omoniyi Alimi</span><span>{slide.section}</span>
          </header>
          <div key={idx} className="deck__body">{slide.body}</div>
          {slide.sd && <img key={`sd-${idx}`} src={SD[slide.sd]} alt="" aria-hidden="true" className={`deck__sd deck__sd--${slide.pos}`} />}
          <footer className="deck__folio">
            <span>omoniyialimi.com</span>
            <span className="deck__count">{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          </footer>
        </section>
      </div>

      {notes && (
        <aside className="deck__notes" aria-label="Speaker cues">
          <p className="deck__notes-label">Speaker cues · {slide.title}</p>
          <ul>{slide.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </aside>
      )}

      <nav className="deck__controls" aria-label="Slide controls">
        <div className="deck__arrows">
          <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous slide">←</button>
          <button type="button" onClick={() => go(idx + 1)} disabled={idx === total - 1} aria-label="Next slide">→</button>
        </div>
        <div className="deck__dots">
          {slides.map((x, i) => (
            <button
              type="button"
              key={x.title}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${x.title}`}
              aria-current={i === idx ? "step" : undefined}
              className={i === idx ? "is-current" : undefined}
            />
          ))}
        </div>
        <div className="deck__tools">
          <span className="deck__count-sm">{idx + 1} / {total}</span>
          <button type="button" onClick={() => setNotes((v) => !v)} aria-pressed={notes}>Notes (N)</button>
          <button type="button" onClick={toggleFullscreen}>{fullscreen ? "Exit full screen" : "Full screen (F)"}</button>
        </div>
      </nav>
    </main>
  );
}
