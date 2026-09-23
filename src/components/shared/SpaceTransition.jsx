import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { motionQuery } from "../../lib/motionPreference";
import { Link, useNavigate } from "react-router-dom";
import "./space-transition.css";

// One shared transition grammar for every jump between the site's three
// spaces (Portfolio / Studio / UI Kits): a field of stardust gathers and
// thickens until it covers the viewport, the route swaps underneath it,
// then it disperses to reveal the destination. Only the tone (color)
// changes per destination — the motion is always identical, so the
// pattern reads as one signature move rather than a different effect
// bolted onto each link.
const TONES = {
  portfolio: { dust: "117,105,227", wash: "255,250,214" }, // portfolio lavender, on its own cream
  studio: { dust: "122,51,60", wash: "255,250,214" }, // studio's oxblood accent, same cream underneath
  ui: { dust: "142,120,235", wash: "255,250,214" }, // launchkit's lilac accent
};
const DEFAULT_TONE = "portfolio";

const COVER_MS = 620;
const REVEAL_MS = 720;
// More, smaller particles than a first pass — fine dust/starfield rather
// than a handful of visible dots.
const PARTICLE_COUNT = 190;

// Editorial-minimal label shown once the dust has mostly gathered —
// just names the space you're arriving in, no verb.
const SPACE_LABELS = { portfolio: "Portfolio", studio: "Studio", ui: "UI Kit" };
// Each space's own display face, matching its own page headings — Studio
// runs on Fraunces (its dossier serif) while Portfolio and UI Kit share
// the site's Space Grotesk. Keeps the curtain's typography an extension
// of the destination, not a generic overlay.
const SPACE_FONTS = {
  portfolio: '"Space Grotesk", sans-serif',
  studio: '"Fraunces", "Iowan Old Style", "Georgia", serif',
  ui: '"Space Grotesk", sans-serif',
};

const random = (n) => {
  const v = Math.sin(n * 127.1 + 31.7) * 43758.5453;
  return v - Math.floor(v);
};

function makeParticles(w, h) {
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(i * 3 + 1) * w,
      y: random(i * 3 + 2) * h,
      r: 0.5 + random(i * 3 + 3) * 1.4,
      driftX: (random(i * 5 + 1) - 0.5) * 48,
      driftY: (random(i * 5 + 2) - 0.5) * 48,
      delay: random(i * 7 + 1) * 0.35,
      alpha: 0.35 + random(i * 5 + 3) * 0.5,
    });
  }
  return particles;
}

const SpaceTransitionContext = createContext(null);

export function SpaceTransitionProvider({ children }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const state = useRef({
    active: false,
    phase: "idle",
    tone: DEFAULT_TONE,
    start: 0,
    navigated: false,
    pendingPath: null,
  });

  const draw = useCallback(
    (now) => {
      const s = state.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const { w, h } = sizeRef.current;
      if (!s.active) {
        ctx.clearRect(0, 0, w, h);
        return;
      }

      const tone = TONES[s.tone] || TONES[DEFAULT_TONE];
      let progress = 0;

      if (s.phase === "cover") {
        progress = Math.min(1, (now - s.start) / COVER_MS);
        if (progress >= 1 && !s.navigated) {
          s.navigated = true;
          navigate(s.pendingPath);
          s.phase = "reveal";
          s.start = now;
        }
      } else if (s.phase === "reveal") {
        const revealProgress = Math.min(1, (now - s.start) / REVEAL_MS);
        progress = 1 - revealProgress;
        if (revealProgress >= 1) {
          s.active = false;
          s.phase = "idle";
          ctx.clearRect(0, 0, w, h);
          return;
        }
      }

      const eased = progress * progress * (3 - 2 * progress); // smoothstep
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${tone.wash},${(eased * 0.94).toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        const span = 1 - p.delay || 1;
        const local = Math.max(0, Math.min(1, (eased - p.delay) / span));
        if (local <= 0) continue;
        const x = p.x + p.driftX * (1 - local);
        const y = p.y + p.driftY * (1 - local);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${tone.dust},${(p.alpha * local).toFixed(3)})`;
        ctx.arc(x, y, p.r * (0.6 + local * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      // Label fades in once the field is mostly gathered, and fades back
      // out with it on reveal — never a hard cut in either direction.
      const textAlpha = Math.max(0, Math.min(1, (eased - 0.22) / 0.78));
      if (textAlpha > 0.01) {
        const label = SPACE_LABELS[s.tone] || SPACE_LABELS[DEFAULT_TONE];
        const face = SPACE_FONTS[s.tone] || SPACE_FONTS[DEFAULT_TONE];
        const size = Math.max(28, Math.min(64, Math.min(w, h) * 0.055));
        const rise = (1 - textAlpha) * 14;
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.fillStyle = "#111111";
        ctx.font = `500 ${size}px ${face}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, w / 2, h / 2 + rise);
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(draw);
    },
    [navigate]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = motionQuery();
    reduceMotionRef.current = motion.matches;
    const onMotionChange = () => {
      reduceMotionRef.current = motion.matches;
    };
    motion.addEventListener("change", onMotionChange);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      particlesRef.current = makeParticles(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const goTo = useCallback(
    (path, tone = DEFAULT_TONE) => {
      if (reduceMotionRef.current) {
        navigate(path);
        return;
      }
      const s = state.current;
      s.active = true;
      s.phase = "cover";
      s.tone = TONES[tone] ? tone : DEFAULT_TONE;
      s.start = performance.now();
      s.navigated = false;
      s.pendingPath = path;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(draw);
    },
    [draw, navigate]
  );

  return (
    <SpaceTransitionContext.Provider value={{ goTo }}>
      {children}
      <canvas ref={canvasRef} className="space-curtain" aria-hidden="true" />
    </SpaceTransitionContext.Provider>
  );
}

export function useSpaceTransition() {
  const ctx = useContext(SpaceTransitionContext);
  if (!ctx) {
    throw new Error("useSpaceTransition must be used inside SpaceTransitionProvider");
  }
  return ctx;
}

// Drop-in replacement for react-router's <Link> at the three places the
// site actually crosses spaces (Portfolio / Studio / UI Kits). Ordinary
// clicks trigger the dust sweep; modified clicks (new tab, etc.) and
// right-clicks fall through to normal <Link> behavior untouched.
export function SpaceLink({ to, tone, onClick, children, ...props }) {
  const { goTo } = useSpaceTransition();
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goTo(to, tone);
  };
  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
