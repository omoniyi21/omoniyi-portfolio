import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isMotionReduced } from "../../lib/motionPreference";
import AliHello from "./AliHello";
import bridge1400 from "../../assets/images/uikit/hero-bridge-1400.webp";
import bridge2600 from "../../assets/images/uikit/hero-bridge-2600.webp";
import bar1400 from "../../assets/images/uikit/hero-bar-1400.webp";
import bar2600 from "../../assets/images/uikit/hero-bar-2600.webp";
import "./hero-assembly.css";

// The /uikit hero is itself a LaunchKit screen. The headline, copy and buttons
// (children) never move, so they read from the first frame. Around them a
// window forms: its bar and frame arrive, the photo opens wide below and
// shrinks into its place as a card, and a few pieces settle beside it.
// The settled screen is the default markup, so with motion off the page is
// complete. It plays once per visitor, only when the photo is in view, never
// on a deep link; a click, tap, key or scrolling past jumps to the end.
const PLAYED_KEY = "oui-hero-played";
const HOLD_MS = 500;
const RUN_MS = 3400;
const PHOTOS = {
  light: { set: `${bridge1400} 1400w, ${bridge2600} 2600w`, src: bridge1400, alt: "the Golden Gate Bridge in fog" },
  dark: { set: `${bar1400} 1400w, ${bar2600} 2600w`, src: bar1400, alt: "an empty bar at night" },
};

function shouldPlay() {
  if (typeof window === "undefined" || isMotionReduced() || window.location.hash) return false;
  try { return !localStorage.getItem(PLAYED_KEY); } catch { return true; }
}

// --d staggers each piece; --from is where it drifts in from. No rotation:
// LaunchKit motion is productive, not playful.
const piece = (delay, from = "0, 16px") => ({ "data-piece": "", style: { "--d": `${delay}ms`, "--from": from } });

export default function HeroAssembly({ theme = "light", children }) {
  const [phase, setPhase] = useState(() => (shouldPlay() ? "pre" : "settled"));
  const firstPhase = useRef(phase);
  const stage = useRef(null);
  const photo = useRef(null);
  const shot = PHOTOS[theme] ?? PHOTOS.light;

  // Before the first paint, place the copy over the wide photo (and a
  // little larger) with a transform, so its settled place in the right column
  // stays the real layout. Going to "go" drops the transform and it glides home.
  const shell = useRef(null);
  const wrap = useRef(null);
  useLayoutEffect(() => {
    if (phase !== "pre") return undefined;
    const place = () => {
      const box = stage.current?.getBoundingClientRect();
      const text = wrap.current?.getBoundingClientRect();
      if (!box || !text) return;
      // over the fog on the right, clear of the bridge on the left
      const dx = box.left + box.width * 0.64 - (text.left + text.width / 2);
      const dy = box.top + box.height / 2 - (text.top + text.height / 2);
      shell.current.style.setProperty("--copy-x", `${Math.round(dx)}px`);
      shell.current.style.setProperty("--copy-y", `${Math.round(dy)}px`);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [phase]);

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
    <div ref={shell} className="oui-shell" data-phase={phase}>
      <div className="oui-shell-bar" aria-hidden="true" {...piece(200, "0, -10px")}>
        <span className="oui-shell-brand">✦ LaunchKit</span>
        <span className="oui-shell-tabs"><span className="is-active">Overview</span><span>Components</span><span>Pro</span></span>
        <span className="oui-shell-end"><span className="oui-badge">＋ Create</span><span className="oui-shell-avatar">O</span></span>
      </div>
      <div ref={stage} className="oui-stage">
        <div className="oui-stage-photo">
          <img ref={photo} src={shot.src} srcSet={shot.set} sizes="(max-width: 700px) 100vw, 1312px" alt={`Omoniyi’s photo of ${shot.alt}`} width="1400" height="636" fetchPriority="high" decoding="async" />
        </div>
        <div className="oui-stage-slot" aria-hidden="true">
          <span className="oui-stage-toast" {...piece(1000, "0, -12px")}>
            <span className="oui-stage-check"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" /></svg></span>
            <span><strong>Version one shipped</strong><small>Just now</small></span>
          </span>
          <span className="oui-stage-tag" {...piece(1250, "0, 12px")}><span className="oui-badge oui-badge--white">Field notes</span><span className="oui-badge oui-badge--green">Ready to ship</span></span>
          <div className="oui-stage-signin" {...piece(1450, "24px, 16px")}>
            <AliHello className="oui-stage-ali" />
            <span className="oui-badge">Pro preview</span>
            <strong>Welcome back</strong>
            <span className="oui-stage-field">you@studio.com</span>
            <span className="oui-stage-field">••••••••</span>
            <span className="oui-stage-pill">Sign in</span>
          </div>
        </div>
        <div ref={wrap} className="oui-copy-wrap">
          <div className="oui-hero-copy">{children}</div>
          {/* A right-aligned, white twin of the copy for the opening frame. It
              crossfades into the real (left-aligned) copy while both travel,
              since text alignment itself can't animate. Gone once settled. */}
          {phase !== "settled" && <div className="oui-hero-copy oui-hero-ghost" aria-hidden="true" inert>{children}</div>}
        </div>
      </div>
    </div>
  );
}
