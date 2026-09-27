import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isMotionReduced } from "../../lib/motionPreference";
import "./space-transition.css";
import wordPro from "../../assets/branding/marks/omoniyi..svg";
import noteAlimi from "../../assets/branding/marks/alimi.svg";
import wordStudioSmall from "../../assets/branding/marks/studio.svg";
import wordStudio from "../../assets/branding/marks/custom-font-frances.svg";
import wordUiDark from "../../assets/branding/marks/omoniyi-ui.svg";
import wordUiLight from "../../assets/branding/marks/omoniyi-ui-white.svg";
import tagUiBlack from "../../assets/branding/marks/omoniyiui-black-square.svg";
import tagUiLavender from "../../assets/branding/marks/omoniyiui-lav-square.svg";

// One transition grammar for every jump between the site's three spaces
// (Portfolio / Studio / UI Kit): a curtain in the destination's colour rises
// over the page, the three marks flash through in turn, the sequence lands on
// the destination's mark, the route swaps underneath, and the curtain lifts.
//
// Curtains: Portfolio = ink, Studio = oxblood, UI = lilac→lavender gradient.
// Marks follow the brand sheet's tile presentation (Stardust file, "03 — The
// Brand and its arms"): light tiles on the two dark curtains, dark tiles on
// UI's pale gradient.
const SPACES = ["portfolio", "studio", "ui"];
const DEFAULT_TONE = "portfolio";
const MARK_VARIANT = { portfolio: "light", studio: "light", ui: "dark" };

const COVER_MS = 560; // curtain rise (matches the CSS transition)
const FLASH_START_MS = 280; // marks start flashing as the curtain nears the top
const FLASH_STEPS_MS = [190, 190, 210, 240, 280]; // gaps between six beats; slows into the landing
const HOLD_MS = 440; // time the landed mark is held before the curtain lifts
const REVEAL_MS = 620; // curtain lift (matches the CSS transition)

// Six beats = two full passes through the three marks, ending on the target.
function flashSequence(target) {
  const start = (SPACES.indexOf(target) + 1) % SPACES.length;
  return Array.from({ length: 6 }, (_, i) => SPACES[(start + i) % SPACES.length]);
}

// Single-colour wordmarks are drawn as CSS masks so each can take the tile's
// ink colour (light and dark variants from one file). Multi-colour pieces
// (the lavender "alimi" note, the ui tags) are used as-is.
function Glyph({ src, w, h, className = "" }) {
  return <span className={`space-mark__glyph ${className}`} style={{ "--glyph": `url("${src}")`, width: w, height: h }} />;
}

function ProfessionalMark({ variant }) {
  return (
    <div className={`space-mark space-mark--pro space-mark--${variant}`}>
      <Glyph src={wordPro} w={139} h={36} />
      <img className="space-mark__pro-note" src={noteAlimi} width="49" height="36" alt="" />
    </div>
  );
}

function StudioMark({ variant }) {
  return (
    <div className={`space-mark space-mark--studio space-mark--${variant}`}>
      <Glyph src={wordStudioSmall} w={53} h={15} className="space-mark__studio-small" />
      <Glyph src={wordStudio} w={148} h={32} />
    </div>
  );
}

function UIMark({ variant }) {
  const light = variant === "light";
  return (
    <div className={`space-mark space-mark--ui space-mark--${variant}`}>
      <img src={light ? wordUiDark : wordUiLight} width="170" height="44" alt="" />
      <img src={light ? tagUiBlack : tagUiLavender} width="55" height="55" alt="" />
    </div>
  );
}

const MARKS = { portfolio: ProfessionalMark, studio: StudioMark, ui: UIMark };

const SpaceTransitionContext = createContext(null);

export function SpaceTransitionProvider({ children }) {
  const navigate = useNavigate();
  const timers = useRef([]);
  const busy = useRef(false);
  const [curtain, setCurtain] = useState({ phase: "idle", tone: DEFAULT_TONE, beat: null, landed: false });

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => clearTimers, []);

  const goTo = useCallback(
    (path, tone = DEFAULT_TONE) => {
      if (isMotionReduced()) {
        navigate(path);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      clearTimers();

      const target = SPACES.includes(tone) ? tone : DEFAULT_TONE;
      const beats = flashSequence(target);

      setCurtain({ phase: "cover", tone: target, beat: null, landed: false });

      let t = FLASH_START_MS;
      beats.forEach((beat, i) => {
        at(t, () => setCurtain((c) => ({ ...c, beat })));
        if (i < FLASH_STEPS_MS.length) t += FLASH_STEPS_MS[i];
      });
      const landAt = t;
      at(landAt, () => setCurtain((c) => ({ ...c, landed: true })));

      // Swap the route once the curtain fully covers the page.
      at(COVER_MS + 40, () => navigate(path));

      const revealAt = Math.max(landAt, COVER_MS + 40) + HOLD_MS;
      at(revealAt, () => setCurtain((c) => ({ ...c, phase: "reveal" })));
      at(revealAt + REVEAL_MS, () => {
        busy.current = false;
        setCurtain({ phase: "idle", tone: target, beat: null, landed: false });
      });
    },
    [navigate]
  );

  const variant = MARK_VARIANT[curtain.tone];

  return (
    <SpaceTransitionContext.Provider value={{ goTo }}>
      {children}
      <div className="space-curtain" data-phase={curtain.phase} data-tone={curtain.tone} aria-hidden="true">
        <div className="space-curtain__panel">
          <div className={`space-curtain__stage${curtain.landed ? " is-landed" : ""}`}>
            {SPACES.map((id) => {
              const Mark = MARKS[id];
              return (
                <div key={id} className="space-curtain__slot" data-on={curtain.beat === id ? "true" : undefined}>
                  <Mark variant={variant} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
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

// Drop-in replacement for react-router's <Link> at the places the site
// crosses spaces (Portfolio / Studio / UI Kit). Ordinary clicks run the
// curtain; modified clicks (new tab, etc.) and right-clicks fall through to
// normal <Link> behavior untouched.
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
