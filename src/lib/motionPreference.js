// One source of truth for "should this move?". The visitor's device setting
// is the default; the on-site switch can override it either way and is
// remembered. CSS reads html[data-motion="reduce"]; JS reads isMotionReduced().
const KEY = "omoniyi-motion";
const EVENT = "motionpreferencechange";
const query = () => window.matchMedia("(prefers-reduced-motion: reduce)");

function stored() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function isMotionReduced() {
  if (typeof window === "undefined") return false;
  const choice = stored();
  if (choice === "reduce") return true;
  if (choice === "full") return false;
  return query().matches;
}

function apply() {
  document.documentElement.dataset.motion = isMotionReduced() ? "reduce" : "full";
}

export function initMotionPreference() {
  if (typeof window === "undefined") return;
  apply();
  query().addEventListener("change", () => { apply(); window.dispatchEvent(new Event(EVENT)); });
}

export function setMotionReduced(reduce) {
  try { localStorage.setItem(KEY, reduce ? "reduce" : "full"); } catch { /* private mode: session only */ }
  apply();
  window.dispatchEvent(new Event(EVENT));
}

export function onMotionPreferenceChange(callback) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

// Drop-in replacement for matchMedia('(prefers-reduced-motion: reduce)')
// so existing canvas code keeps its .matches / change-listener shape.
export function motionQuery() {
  const listeners = new Map();
  return {
    get matches() { return isMotionReduced(); },
    addEventListener(_type, fn) { const off = onMotionPreferenceChange(fn); listeners.set(fn, off); },
    removeEventListener(_type, fn) { listeners.get(fn)?.(); listeners.delete(fn); },
  };
}
