import { useEffect, useRef, useState } from "react";
import { isMotionReduced } from "../../lib/motionPreference";
import bridge900 from "../../assets/images/uikit/hero-bridge-900.webp";
import bridge1400 from "../../assets/images/uikit/hero-bridge-1400.webp";
import bridge2600 from "../../assets/images/uikit/hero-bridge-2600.webp";
import bar900 from "../../assets/images/uikit/hero-bar-900.webp";
import bar1400 from "../../assets/images/uikit/hero-bar-1400.webp";
import bar2600 from "../../assets/images/uikit/hero-bar-2600.webp";
import "./hero-assembly.css";

// The /uikit hero: Omoniyi's photo opens as the whole scene, then shrinks
// into its place as one card in a LaunchKit screen while the rest of the UI
// settles around it. The settled screen is the default markup, so with motion
// off (or no JS) the page is complete. It plays once per visitor, never on a
// deep link, and a click, tap, key or scrolling past it jumps to the end.
const PLAYED_KEY = "oui-hero-played";
const HOLD_MS = 350; // let the scene register before it moves
const RUN_MS = 2000; // photo shrink plus the last piece settling
const SIZES = "(max-width: 1440px) 92vw, 1312px";

function shouldPlay() {
  if (typeof window === "undefined" || isMotionReduced() || window.location.hash) return false;
  try { return !localStorage.getItem(PLAYED_KEY); } catch { return true; }
}

// --d staggers each piece; --from is where it drifts in from (no rotation:
// LaunchKit motion is productive, not playful).
const piece = (delay, from = "0, 16px") => ({ "data-piece": "", style: { "--d": `${delay}ms`, "--from": from } });

export default function HeroAssembly() {
  const [phase, setPhase] = useState(() => (shouldPlay() ? "pre" : "settled"));
  const firstPhase = useRef(phase);
  const stage = useRef(null);
  const photo = useRef(null);

  // Runs once. Waits until the photo is decoded and the stage is mostly in
  // view, holds the wide scene for a beat, then plays. A click, tap or key
  // ends it at once, and so does scrolling the stage out of view, so nobody
  // ever waits for it and nothing hijacks the scroll.
  useEffect(() => {
    if (firstPhase.current !== "pre") return undefined;
    const img = photo.current;
    const timers = [];
    let done = false;
    let started = false;
    let visible = false;
    let loaded = false;
    let observer = null;
    const settle = () => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      observer?.disconnect();
      setPhase("settled");
    };
    const start = () => {
      if (started || done) return;
      started = true;
      try { localStorage.setItem(PLAYED_KEY, "1"); } catch { /* private mode: plays again next visit */ }
      timers.push(setTimeout(() => {
        if (done) return;
        setPhase("go");
        timers.push(setTimeout(settle, RUN_MS));
      }, HOLD_MS));
    };
    const events = ["pointerdown", "keydown"];
    events.forEach(type => window.addEventListener(type, settle, { passive: true }));
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.6) { visible = true; if (loaded) start(); }
        else if (started && ratio < 0.15) settle();
      }, { threshold: [0, 0.15, 0.6] });
      observer.observe(stage.current);
    } else {
      visible = true;
    }
    const ready = img && img.complete && img.naturalWidth > 0 ? Promise.resolve(true)
      : Promise.race([img?.decode().then(() => true, () => false) ?? Promise.resolve(false), new Promise(resolve => timers.push(setTimeout(() => resolve(false), 2500)))]);
    ready.then(ok => {
      if (done) return;
      if (!ok) { settle(); return; } // never animate an empty frame
      loaded = true;
      if (visible) start();
    });
    return () => {
      done = true;
      timers.forEach(clearTimeout);
      observer?.disconnect();
      events.forEach(type => window.removeEventListener(type, settle));
    };
  }, []);

  return (
    <figure ref={stage} className="oui-stage" data-phase={phase} aria-label="A LaunchKit screen assembling over Omoniyi’s photo of the Golden Gate Bridge in fog">
      <div className="oui-stage-photo" aria-hidden="true">
        <picture>
          <source media="(prefers-color-scheme: dark) and (max-width: 600px)" srcSet={bar900} />
          <source media="(prefers-color-scheme: dark)" srcSet={`${bar1400} 1400w, ${bar2600} 2600w`} sizes={SIZES} />
          <source media="(max-width: 600px)" srcSet={bridge900} />
          <img ref={photo} src={bridge1400} srcSet={`${bridge1400} 1400w, ${bridge2600} 2600w`} sizes={SIZES} alt="" width="1400" height="636" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="oui-stage-ui" aria-hidden="true">
        <div className="oui-stage-bar" {...piece(450, "0, -12px")}>
          <strong>✦ Orbit</strong>
          <span className="is-active">Overview</span><span>Projects</span><span>Team</span>
          <span className="oui-badge">＋ Create</span>
          <span className="oui-stage-avatar">A</span>
        </div>
        <div className="oui-stage-slot">
          <span className="oui-stage-toast" {...piece(1050, "24px, -12px")}>
            <span className="oui-stage-check"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" /></svg></span>
            <span><strong>Version one shipped</strong><small>Just now</small></span>
          </span>
          <span className="oui-stage-tag" {...piece(900, "0, 12px")}><span className="oui-badge oui-badge--white">Field notes</span><span className="oui-badge oui-badge--green">Ready to ship</span></span>
        </div>
        <div className="oui-stage-intro">
          <div {...piece(530)}><h3>Good morning, Alex</h3><p>Here’s what’s moving forward.</p></div>
          <div className="oui-stage-metrics">
            {[["Active projects", "12"], ["Ready to ship", "04"], ["Completed", "28"]].map(([label, value], i) => <div key={label} {...piece(610 + i * 60)}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
        </div>
        <div className="oui-stage-list">
          <h4 {...piece(760)}>Your projects</h4>
          {[["Website refresh", "In review", ""], ["Version one", "Ready to ship", "oui-badge--green"]].map(([name, status, tone], i) => <div key={name} className="oui-stage-row" {...piece(820 + i * 70)}><span>{name}</span><span className={`oui-badge ${tone}`}>{status}</span></div>)}
          <div className="oui-stage-progress" {...piece(960)}><span>Launch checklist</span><span className="oui-stage-meter"><span /></span><small>3 of 4 done</small></div>
        </div>
      </div>
      <div className="oui-stage-signin" aria-hidden="true" {...piece(1150, "32px, 24px")}>
        <span className="oui-badge">Pro pattern</span>
        <strong>Welcome back</strong>
        <span className="oui-stage-field">you@studio.com</span>
        <span className="oui-stage-field">••••••••</span>
        <span className="oui-stage-pill">Sign in</span>
      </div>
    </figure>
  );
}
