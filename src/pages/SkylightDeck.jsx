import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import floating from "../assets/branding/celestial/stardust-asteroid.webp";
import thinking from "../assets/branding/sd-variants/sd-thinking.webp";
import movie from "../assets/branding/sd-variants/sd-watching-a-movie.webp";
import sleeping from "../assets/branding/sd-variants/sd-sleeping.webp";
import lost from "../assets/branding/stardust-creature-kit/png/1024/lost-confused.webp";
import exploring from "../assets/branding/sd-variants/sd-exploring.webp";
import "./skylight-deck.css";

// Unlisted interview deck for Skylight (U.S. Air Force). Not linked from the
// site, left out of the sitemap, and served with noindex (see pageMetadata.js
// and public/_headers). Slides are drawn on a fixed 1920x1080 stage and scaled
// to fit, so the layout holds on any screen share.

const SD = { floating, thinking, movie, sleeping, lost, exploring };

const Kicker = ({ children }) => <p className="deck__kicker">{children}</p>;
const H = ({ children, size = 104 }) => <h2 className="deck__h" style={{ fontSize: size }}>{children}</h2>;
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

const slides = [
  {
    title: "Introduction", section: "Skylight · Senior/Staff Product Designer", sd: "floating", pos: "br",
    notes: ["Thank them for the time; frame the next 60 to 90 minutes.", "Two case studies, one vignette, then alignment and conversation."],
    body: (<>
      <Kicker>Skylight · U.S. Air Force</Kicker>
      <H size={150}>Designing for the<br /><em className="deck__accent">operational</em> reality.</H>
      <p className="deck__lede">Omoniyi Alimi, Senior Product Designer</p>
    </>),
  },
  {
    title: "Agenda", section: "Today", sd: "exploring", pos: "tr",
    notes: ["Set time expectations per section.", "Invite interruptions and questions throughout."],
    body: (<>
      <Kicker>Today</Kicker>
      <H>What we’ll walk through</H>
      <ol className="deck__agenda">
        {["U.S. Copyright Office: Accounting & Payments Discovery", "U.S. House: Committee Voting Platform", "Vignette: Sultry Tips", "Skylight & Air Force alignment"].map((t, i) => (
          <li key={t}>
            <span className="deck__agenda-n">0{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </>),
  },
  {
    title: "Copyright Office: Context", section: "01 · U.S. Copyright Office", sd: "thinking", pos: "tr",
    notes: ["Accounting had been living inside the admin workspace.", "Why separation was needed to properly understand it."],
    body: (<>
      <Kicker>01 · U.S. Copyright Office</Kicker>
      <H>Accounting &amp; Payments<br />Discovery</H>
      <Flow from="Buried in the admin workspace" to="Its own dedicated discovery" />
    </>),
  },
  {
    title: "Copyright Office: Cadence", section: "01 · U.S. Copyright Office", sd: "exploring", pos: "br",
    notes: ["Who the SMEs were and how sessions were structured.", "How trust was built through consistent cadence."],
    body: (<>
      <Kicker>01 · How the work ran</Kicker>
      <H>A steady rhythm<br />with the experts</H>
      <Points items={[["2×", "SME sessions led every week"], ["2.5", "Months of sustained discovery"], ["SMEs", "Accounting experts at the table"]]} />
    </>),
  },
  {
    title: "Copyright Office: Legacy", section: "01 · U.S. Copyright Office", sd: "lost", pos: "tr",
    notes: ["Walk through a Siebel workflow that was hardest to untangle.", "Show how the dependency model changed the team’s decisions."],
    body: (<>
      <Kicker>01 · Making sense of legacy</Kicker>
      <H>Deconstructing Siebel</H>
      <div className="deck__pair">
        {[["Deconstruct", "Legacy Siebel workflows, step by step"], ["Model", "Complex financial dependencies, made visible"]].map(([a, b]) => (
          <div key={a} className="deck__pair-item">
            <p className="deck__pair-a">{a}</p>
            <p className="deck__pair-b">{b}</p>
          </div>
        ))}
      </div>
    </>),
  },
  {
    title: "House: Context", section: "02 · U.S. House of Representatives", sd: "floating", pos: "br",
    notes: ["Describe the paper vote process and its risks.", "What one digital record means for the committee."],
    body: (<>
      <Kicker>02 · U.S. House of Representatives</Kicker>
      <H>Committee Voting<br />Platform</H>
      <Flow from="Paper votes" to="One digital record" />
    </>),
  },
  {
    title: "House: Research", section: "02 · U.S. House of Representatives", sd: "thinking", pos: "br",
    notes: ["Who was interviewed: leadership and clerks.", "Key insight that reshaped the direction."],
    body: (<>
      <Kicker>02 · Listening first</Kicker>
      <div className="deck__stat">
        <p className="deck__stat-n">18</p>
        <p className="deck__stat-t">interviews with committee leadership and clerks</p>
      </div>
    </>),
  },
  {
    title: "House: Design", section: "02 · U.S. House of Representatives", sd: "exploring", pos: "tr",
    notes: ["Show a high-density screen and explain why density was right.", "Where USWDS was extended and how it stayed consistent."],
    body: (<>
      <Kicker>02 · Design principles</Kicker>
      <H>Zero-error, under pressure</H>
      <div className="deck__trio">
        {[["High-density data", "Everything a clerk needs, at a glance"], ["Context close", "Decisions next to the information behind them"], ["USWDS, extended", "Built on the standard, shaped for operations"]].map(([a, b]) => (
          <div key={a} className="deck__trio-item">
            <p className="deck__trio-a">{a}</p>
            <p className="deck__trio-b">{b}</p>
          </div>
        ))}
      </div>
    </>),
  },
  {
    title: "Sultry Tips", section: "03 · Vignette", sd: "movie", pos: "br",
    notes: ["Keep this short and personal.", "Connect craft and hospitality back to utilitarian government tools."],
    body: (<>
      <Kicker>03 · Vignette</Kicker>
      <H size={140}><em className="deck__italic">Sultry Tips</em></H>
      <div className="deck__tags">
        {["Typographic craft", "Restraint", "Design hospitality"].map((t) => <span key={t}>{t}</span>)}
      </div>
      <p className="deck__quote">“Utilitarian systems deserve care too.”</p>
    </>),
  },
  {
    title: "Skylight & Air Force", section: "04 · Alignment", sd: "exploring", pos: "tr",
    notes: ["Tie each value to a concrete moment from the case studies.", "Why the Air Force contract specifically excites you."],
    body: (<>
      <Kicker>04 · Skylight &amp; the Air Force</Kicker>
      <H>Leave teams more capable</H>
      <Points items={[["Build", "Capacity inside government teams"], ["Ground", "Design in operational reality"], ["Hand off", "Teams stronger than when we arrived"]]} />
    </>),
  },
  {
    title: "Thank you", section: "Conversation", sd: "sleeping", pos: "br",
    notes: ["Open the floor.", "Have questions ready about the team, the contract, and success in 6 months."],
    body: (<>
      <Kicker>Conversation</Kicker>
      <H size={170}>Thank you.</H>
      <p className="deck__closing">Questions, tangents, and good films welcome.</p>
      <p className="deck__url">omoniyialimi.com</p>
    </>),
  },
];

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
          <img key={`sd-${idx}`} src={SD[slide.sd]} alt="" aria-hidden="true" className={`deck__sd deck__sd--${slide.pos}`} />
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
