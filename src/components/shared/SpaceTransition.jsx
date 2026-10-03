import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isMotionReduced } from "../../lib/motionPreference";
import { SpaceTransitionContext, useSpaceTransition } from "./spaceTransitionContext";
import "./space-transition.css";
import { ProfessionalMark, StudioMark, UIMark } from "./BrandMarks";

// One transition grammar for every jump between the site's three spaces
// (Portfolio / Studio / UI Kit): a curtain in the destination's colour rises
// over the page, the three marks flash through in turn, the sequence lands on
// the destination's mark, the route swaps underneath, and the curtain lifts.
// The Studio mark's eye stays drowsy while the marks flash and opens only
// once the sequence lands on Studio, like being let in.
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
// Studio holds longer: its eye lands drowsy, then the lid lifts to "Knowing"
// and the brow follows (studio-eye.css), and that has to finish on screen.
const HOLD_MS_BY_TONE = { studio: 760 };
const REVEAL_MS = 620; // curtain lift (matches the CSS transition)

// Six beats = two full passes through the three marks, ending on the target.
function flashSequence(target) {
  const start = (SPACES.indexOf(target) + 1) % SPACES.length;
  return Array.from({ length: 6 }, (_, i) => SPACES[(start + i) % SPACES.length]);
}

const MARKS = { portfolio: ProfessionalMark, studio: StudioMark, ui: UIMark };


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

      const revealAt = Math.max(landAt, COVER_MS + 40) + (HOLD_MS_BY_TONE[target] ?? HOLD_MS);
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
                  <Mark variant={variant} awake={curtain.landed && curtain.beat === id} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SpaceTransitionContext.Provider>
  );
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
