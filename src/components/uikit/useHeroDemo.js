import { useCallback, useEffect, useRef, useState } from "react";
import { isMotionReduced, onMotionPreferenceChange } from "../../lib/motionPreference";

// After the hero assembles, its pieces run one real flow with LaunchKit
// components: sign in, a Field notes draft, mark it ready, publish, shipped.
// Every beat is a component changing state. It plays three times, then rests
// on the shipped frame. It only runs on desktop with motion on, pauses when
// the hero is off screen or the tab is hidden, and the visitor can pause or
// replay it. With motion off the page shows the settled frame, unchanged.

const EMAIL = "you@studio.com";
const LOOPS = 3;
const START_DELAY = 1400; // let the settled screen breathe before the first beat

// The frame the hero settles on, and the one it shows with motion off.
export const SETTLED = { card: "signin", email: EMAIL, pass: 8, typing: null, signing: false, title: "", ready: true, pressing: false, publishing: false, live: false, toast: true };
const BLANK = { ...SETTLED, email: "", pass: 0, ready: false, toast: false };

// One loop, as [wait before this beat in ms, what changes].
function timeline(title) {
  const beats = [[0, BLANK], [500, { typing: "email" }]];
  for (let i = 1; i <= EMAIL.length; i += 1) beats.push([62, { email: EMAIL.slice(0, i) }]);
  beats.push([260, { typing: "pass" }]);
  for (let i = 1; i <= 8; i += 1) beats.push([55, { pass: i }]);
  beats.push([380, { typing: null, pressing: true }], [140, { pressing: false, signing: true }]);
  beats.push([850, { signing: false, card: "draft" }], [450, { typing: "title" }]);
  for (let i = 1; i <= title.length; i += 1) beats.push([58, { title: title.slice(0, i) }]);
  beats.push([500, { typing: null }], [250, { ready: true }]);
  beats.push([800, { pressing: true }], [140, { pressing: false, publishing: true }]);
  beats.push([950, { publishing: false, live: true, toast: true }]);
  beats.push([2800, null]); // hold on shipped, then the next loop
  return beats;
}

const desktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 901px)").matches;

export default function useHeroDemo({ enabled, title, stageRef }) {
  const [frame, setFrame] = useState(SETTLED);
  const [status, setStatus] = useState("idle"); // idle | playing | paused | done
  const beats = useRef(timeline(title));
  const at = useRef({ beat: 0, loop: 0 });
  const timer = useRef(null);
  const userPaused = useRef(false);
  const inView = useRef(true);
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => { beats.current = timeline(title); }, [title]);

  const stop = useCallback(() => { clearTimeout(timer.current); timer.current = null; }, []);

  const run = useCallback(() => {
    stop();
    const step = () => {
      const list = beats.current;
      const { beat, loop } = at.current;
      if (beat >= list.length) {
        if (loop + 1 >= LOOPS) { setStatus("done"); return; }
        at.current = { beat: 0, loop: loop + 1 };
        step();
        return;
      }
      const [wait, patch] = list[beat];
      timer.current = setTimeout(() => {
        if (patch) setFrame(f => (patch === BLANK ? BLANK : { ...f, ...patch }));
        at.current = { beat: beat + 1, loop };
        step();
      }, wait);
    };
    setStatus("playing");
    step();
  }, [stop]);

  const canRun = useCallback(() => enabled && !isMotionReduced() && desktop(), [enabled]);

  // start once the hero has settled
  useEffect(() => {
    if (!canRun()) return undefined;
    const t = setTimeout(() => { at.current = { beat: 0, loop: 0 }; run(); }, START_DELAY);
    return () => { clearTimeout(t); stop(); };
  }, [canRun, run, stop]);

  // pause off screen and in a hidden tab; resume only if the visitor didn't pause
  useEffect(() => {
    if (!enabled) return undefined;
    const sync = () => {
      const away = !inView.current || document.hidden;
      if (away && statusRef.current === "playing") { stop(); setStatus("paused"); }
      else if (!away && statusRef.current === "paused" && !userPaused.current) run();
    };
    let observer = null;
    if ("IntersectionObserver" in window && stageRef.current) {
      observer = new IntersectionObserver(([entry]) => { inView.current = entry.intersectionRatio >= 0.3; sync(); }, { threshold: [0, 0.3] });
      observer.observe(stageRef.current);
    }
    document.addEventListener("visibilitychange", sync);
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [enabled, run, stop, stageRef]);

  // motion turned off mid-play: stop on the settled frame
  useEffect(() => onMotionPreferenceChange(() => {
    if (isMotionReduced()) { stop(); setFrame(SETTLED); setStatus("idle"); }
  }), [stop]);

  useEffect(() => stop, [stop]);

  const toggle = useCallback(() => {
    if (statusRef.current === "playing") { userPaused.current = true; stop(); setStatus("paused"); return; }
    userPaused.current = false;
    if (statusRef.current === "done") at.current = { beat: 0, loop: LOOPS - 1 }; // replay once
    run();
  }, [run, stop]);

  return { frame, status, toggle, active: status !== "idle" };
}
